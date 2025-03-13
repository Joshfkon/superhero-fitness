// src/services/appleHealthService.js

import JSZip from 'jszip';
import { DOMParser } from 'xmldom';
import { createOrUpdateBiomarker } from './biomarkerService';

/**
 * Service for parsing and importing Apple Health data
 */
class AppleHealthService {
  /**
   * Parse Apple Health export zip file
   * @param {File} zipFile - The Apple Health export zip file
   * @returns {Promise<Object>} Parsed health data
   */
  async parseExport(zipFile) {
    try {
      // Load the zip file
      const zip = await JSZip.loadAsync(zipFile);
      
      // Find and extract the export.xml file
      const exportXml = zip.file("apple_health_export/export.xml");
      if (!exportXml) {
        throw new Error("Invalid Apple Health export: Missing export.xml file");
      }
      
      // Extract the XML content
      const xmlContent = await exportXml.async("string");
      
      // Parse the XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlContent, "text/xml");
      
      // Extract the relevant data
      const healthData = {
        sleep: this.extractSleepData(xmlDoc),
        heartRate: this.extractHeartRateData(xmlDoc),
        steps: this.extractStepData(xmlDoc),
        workouts: this.extractWorkoutData(xmlDoc),
        weight: this.extractWeightData(xmlDoc)
      };
      
      return healthData;
    } catch (error) {
      console.error("Error parsing Apple Health export:", error);
      throw new Error(`Failed to parse Apple Health data: ${error.message}`);
    }
  }
  
  /**
   * Extract sleep data from Apple Health XML
   * @param {Document} xmlDoc - The parsed XML document
   * @returns {Array} Array of sleep records
   */
  extractSleepData(xmlDoc) {
    const sleepRecords = [];
    const sleepElements = xmlDoc.getElementsByTagName("Record");
    
    for (let i = 0; i < sleepElements.length; i++) {
      const element = sleepElements[i];
      
      // Filter for sleep analysis records
      if (element.getAttribute("type") === "HKCategoryTypeIdentifierSleepAnalysis") {
        const startDate = new Date(element.getAttribute("startDate"));
        const endDate = new Date(element.getAttribute("endDate"));
        const value = element.getAttribute("value");
        
        // Calculate duration in hours
        const durationMs = endDate - startDate;
        const durationHours = durationMs / (1000 * 60 * 60);
        
        // Only include actual sleep records (not in bed records)
        if (value === "HKCategoryValueSleepAnalysisAsleep") {
          sleepRecords.push({
            date: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            startTime: startDate.toISOString(),
            endTime: endDate.toISOString(),
            hours: parseFloat(durationHours.toFixed(2)),
            source: element.getAttribute("sourceName")
          });
        }
      }
    }
    
    // Aggregate sleep records by day
    const aggregatedSleep = this.aggregateSleepByDay(sleepRecords);
    
    return aggregatedSleep;
  }
  
  /**
   * Aggregate sleep records by day
   * @param {Array} sleepRecords - Raw sleep records
   * @returns {Array} Aggregated daily sleep records
   */
  aggregateSleepByDay(sleepRecords) {
    const dailySleep = {};
    
    sleepRecords.forEach(record => {
      const date = record.date;
      
      if (!dailySleep[date]) {
        dailySleep[date] = {
          date,
          hours: 0,
          deepSleep: 0, // Apple Health doesn't directly provide deep sleep data
          quality: 0, // Will need to be estimated
          sources: new Set()
        };
      }
      
      dailySleep[date].hours += record.hours;
      dailySleep[date].sources.add(record.source);
    });
    
    // Convert to array and estimate sleep quality based on duration
    return Object.values(dailySleep).map(day => {
      // Rough estimation of sleep quality based on duration
      // This is a simplistic approach - in reality, quality would depend on many factors
      let quality = 0;
      if (day.hours >= 7) quality = 8;
      else if (day.hours >= 6) quality = 6;
      else if (day.hours >= 5) quality = 4;
      else quality = 2;
      
      // Estimate deep sleep as 20% of total sleep (rough average)
      const deepSleep = parseFloat((day.hours * 0.2).toFixed(1));
      
      return {
        ...day,
        quality,
        deepSleep,
        sources: Array.from(day.sources)
      };
    });
  }
  
  /**
   * Extract heart rate data from Apple Health XML
   * @param {Document} xmlDoc - The parsed XML document
   * @returns {Array} Array of heart rate records
   */
  extractHeartRateData(xmlDoc) {
    const heartRateRecords = [];
    const heartRateElements = xmlDoc.getElementsByTagName("Record");
    
    for (let i = 0; i < heartRateElements.length; i++) {
      const element = heartRateElements[i];
      
      // Filter for heart rate records
      if (element.getAttribute("type") === "HKQuantityTypeIdentifierHeartRate") {
        const date = new Date(element.getAttribute("startDate"));
        const value = parseFloat(element.getAttribute("value"));
        
        heartRateRecords.push({
          date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          timestamp: date.toISOString(),
          bpm: value,
          source: element.getAttribute("sourceName")
        });
      }
    }
    
    // Calculate daily resting heart rate (simplistic approach: min HR during day)
    const dailyHeartRate = this.calculateDailyRestingHeartRate(heartRateRecords);
    
    return dailyHeartRate;
  }
  
  /**
   * Calculate daily resting heart rate
   * @param {Array} heartRateRecords - Raw heart rate records
   * @returns {Array} Daily heart rate summary
   */
  calculateDailyRestingHeartRate(heartRateRecords) {
    const dailyHR = {};
    
    heartRateRecords.forEach(record => {
      const date = record.date;
      
      if (!dailyHR[date]) {
        dailyHR[date] = {
          date,
          records: [],
          sources: new Set()
        };
      }
      
      dailyHR[date].records.push(record.bpm);
      dailyHR[date].sources.add(record.source);
    });
    
    // Calculate statistics for each day
    return Object.values(dailyHR).map(day => {
      const values = day.records;
      values.sort((a, b) => a - b);
      
      // Calculate statistics
      const min = values[0];
      const max = values[values.length - 1];
      const sum = values.reduce((total, val) => total + val, 0);
      const avg = parseFloat((sum / values.length).toFixed(0));
      
      // Resting heart rate is approximated as the lowest 10% of readings
      const restingHeartRateValues = values.slice(0, Math.max(1, Math.ceil(values.length * 0.1)));
      const restingHR = parseFloat((restingHeartRateValues.reduce((total, val) => total + val, 0) / restingHeartRateValues.length).toFixed(0));
      
      return {
        date: day.date,
        restingHR,
        averageHR: avg,
        minHR: min,
        maxHR: max,
        totalReadings: values.length,
        sources: Array.from(day.sources)
      };
    });
  }
  
  /**
   * Extract step count data from Apple Health XML
   * @param {Document} xmlDoc - The parsed XML document
   * @returns {Array} Array of daily step counts
   */
  extractStepData(xmlDoc) {
    const stepRecords = [];
    const stepElements = xmlDoc.getElementsByTagName("Record");
    
    for (let i = 0; i < stepElements.length; i++) {
      const element = stepElements[i];
      
      // Filter for step count records
      if (element.getAttribute("type") === "HKQuantityTypeIdentifierStepCount") {
        const date = new Date(element.getAttribute("startDate"));
        const value = parseInt(element.getAttribute("value"));
        
        stepRecords.push({
          date: date.toISOString().split('T')[0], // Format as YYYY-MM-DD
          timestamp: date.toISOString(),
          steps: value,
          source: element.getAttribute("sourceName")
        });
      }
    }
    
    // Aggregate steps by day
    const dailySteps = {};
    
    stepRecords.forEach(record => {
      const date = record.date;
      
      if (!dailySteps[date]) {
        dailySteps[date] = {
          date,
          totalSteps: 0,
          sources: new Set()
        };
      }
      
      dailySteps[date].totalSteps += record.steps;
      dailySteps[date].sources.add(record.source);
    });
    
    return Object.values(dailySteps).map(day => ({
      ...day,
      sources: Array.from(day.sources)
    }));
  }
  
  /**
   * Extract workout data from Apple Health XML
   * @param {Document} xmlDoc - The parsed XML document
   * @returns {Array} Array of workout records
   */
  extractWorkoutData(xmlDoc) {
    const workoutRecords = [];
    const workoutElements = xmlDoc.getElementsByTagName("Workout");
    
    for (let i = 0; i < workoutElements.length; i++) {
      const element = workoutElements[i];
      
      const startDate = new Date(element.getAttribute("startDate"));
      const endDate = new Date(element.getAttribute("endDate"));
      const workoutType = element.getAttribute("workoutActivityType");
      const duration = parseFloat(element.getAttribute("duration") || "0");
      const totalEnergyBurned = parseFloat(element.getAttribute("totalEnergyBurned") || "0");
      
      // Format workout type to be more readable
      const formattedType = this.formatWorkoutType(workoutType);
      
      workoutRecords.push({
        date: startDate.toISOString().split('T')[0],
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        type: formattedType,
        durationMinutes: parseFloat((duration / 60).toFixed(1)),
        caloriesBurned: totalEnergyBurned,
        source: element.getAttribute("sourceName")
      });
    }
    
    return workoutRecords;
  }
  
  /**
   * Extract weight data from Apple Health XML
   * @param {Document} xmlDoc - The parsed XML document
   * @returns {Array} Array of weight records
   */
  extractWeightData(xmlDoc) {
    const weightRecords = [];
    const weightElements = xmlDoc.getElementsByTagName("Record");
    
    for (let i = 0; i < weightElements.length; i++) {
      const element = weightElements[i];
      
      // Filter for body mass records
      if (element.getAttribute("type") === "HKQuantityTypeIdentifierBodyMass") {
        const date = new Date(element.getAttribute("startDate"));
        const value = parseFloat(element.getAttribute("value"));
        const unit = element.getAttribute("unit");
        
        // Convert to pounds if in kg
        const weightLbs = unit === "kg" ? value * 2.20462 : value;
        
        weightRecords.push({
          date: date.toISOString().split('T')[0],
          timestamp: date.toISOString(),
          weight: parseFloat(weightLbs.toFixed(1)),
          originalUnit: unit,
          source: element.getAttribute("sourceName")
        });
      }
    }
    
    // Get the latest weight reading for each day
    const dailyWeight = {};
    
    weightRecords.forEach(record => {
      const date = record.date;
      
      if (!dailyWeight[date] || new Date(record.timestamp) > new Date(dailyWeight[date].timestamp)) {
        dailyWeight[date] = record;
      }
    });
    
    return Object.values(dailyWeight);
  }
  
  /**
   * Format Apple Health workout type to be more readable
   * @param {string} workoutType - The raw workout type from Apple Health
   * @returns {string} Formatted workout type
   */
  formatWorkoutType(workoutType) {
    // Remove prefix and format as title case
    const formattedType = workoutType.replace('HKWorkoutActivityType', '')
      .replace(/([A-Z])/g, ' $1')
      .trim();
    
    return formattedType.charAt(0).toUpperCase() + formattedType.slice(1);
  }
  
  /**
   * Import the parsed Apple Health data into the app
   * @param {Object} healthData - Parsed health data
   * @returns {Promise<Object>} Import results
   */
  async importHealthData(healthData) {
    try {
      const results = {
        sleep: 0,
        heartRate: 0,
        steps: 0,
        workouts: 0,
        weight: 0
      };
      
      // Import sleep data
      if (healthData.sleep && healthData.sleep.length > 0) {
        for (const sleepRecord of healthData.sleep) {
          const biomarkerData = {
            date: sleepRecord.date,
            sleep: {
              hours: sleepRecord.hours,
              quality: sleepRecord.quality,
              deepSleep: sleepRecord.deepSleep,
              notes: `Imported from Apple Health (${sleepRecord.sources.join(', ')})`
            }
          };
          
          await createOrUpdateBiomarker(biomarkerData);
          results.sleep++;
        }
      }
      
      // Import heart rate data
      if (healthData.heartRate && healthData.heartRate.length > 0) {
        for (const hrRecord of healthData.heartRate) {
          const biomarkerData = {
            date: hrRecord.date,
            vitals: {
              restingHeartRate: hrRecord.restingHR,
              notes: `Imported from Apple Health (${hrRecord.sources.join(', ')})`
            }
          };
          
          await createOrUpdateBiomarker(biomarkerData);
          results.heartRate++;
        }
      }
      
      // The rest of the import logic would follow a similar pattern
      // for steps, workouts, and weight data
      
      return {
        success: true,
        imported: results
      };
    } catch (error) {
      console.error("Error importing Apple Health data:", error);
      throw new Error(`Failed to import Apple Health data: ${error.message}`);
    }
  }
}

export const appleHealthService = new AppleHealthService();