import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  Plus, 
  Scale,
  Save,
  X, 
  ChevronDown, 
  ChevronUp, 
  Ruler, 
  AlertCircle 
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample historical measurement data
const sampleMeasurementHistory = [
  {
    date: '2023-01-01',
    weight: 185,
    bodyFat: 18,
    chest: 42,
    waist: 34,
    hips: 40,
    leftArm: 14,
    rightArm: 14.2,
    leftThigh: 23,
    rightThigh: 23.2,
    shoulders: 46,
    neck: 16,
    leftCalf: 15,
    rightCalf: 15
  },
  {
    date: '2023-02-01',
    weight: 183,
    bodyFat: 17,
    chest: 42.5,
    waist: 33.5,
    hips: 39.8,
    leftArm: 14.2,
    rightArm: 14.4,
    leftThigh: 23.2,
    rightThigh: 23.4,
    shoulders: 46.5,
    neck: 16,
    leftCalf: 15.2,
    rightCalf: 15.2
  },
  {
    date: '2023-03-01',
    weight: 181,
    bodyFat: 16,
    chest: 43,
    waist: 33,
    hips: 39.5,
    leftArm: 14.5,
    rightArm: 14.7,
    leftThigh: 23.4,
    rightThigh: 23.6,
    shoulders: 47,
    neck: 16.1,
    leftCalf: 15.3,
    rightCalf: 15.3
  },
  {
    date: '2023-04-01',
    weight: 180,
    bodyFat: 15,
    chest: 43.5,
    waist: 32.5,
    hips: 39.3,
    leftArm: 14.8,
    rightArm: 15,
    leftThigh: 23.5,
    rightThigh: 23.7,
    shoulders: 47.5,
    neck: 16.2,
    leftCalf: 15.4,
    rightCalf: 15.4
  },
  {
    date: '2023-05-01',
    weight: 178,
    bodyFat: 14,
    chest: 44,
    waist: 32,
    hips: 39,
    leftArm: 15,
    rightArm: 15.2,
    leftThigh: 23.6,
    rightThigh: 23.8,
    shoulders: 48,
    neck: 16.2,
    leftCalf: 15.5,
    rightCalf: 15.5
  },
  {
    date: '2023-06-01',
    weight: 176,
    bodyFat: 14,
    chest: 44,
    waist: 32,
    hips: 38.8,
    leftArm: 15,
    rightArm: 15.2,
    leftThigh: 23.8,
    rightThigh: 24,
    shoulders: 48,
    neck: 16.3,
    leftCalf: 15.6,
    rightCalf: 15.6
  }
];

// Initial measurement data (most recent)
const initialMeasurementData = sampleMeasurementHistory[sampleMeasurementHistory.length - 1];

// Physical goals data
const physicalGoals = {
  weight: 170,
  bodyFat: 10,
  chest: 48,
  waist: 30,
  arms: 17,
  shoulders: 52
};

const Measurements = () => {
  const [activeView, setActiveView] = useState('update');
  const [measurementData, setMeasurementData] = useState({...initialMeasurementData});
  const [measurementHistory, setMeasurementHistory] = useState(sampleMeasurementHistory);
  const [activeMetric, setActiveMetric] = useState('weight');
  const [expandedSections, setExpandedSections] = useState({
    weight: true,
    upperBody: false,
    lowerBody: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setMeasurementData({
      ...measurementData,
      [field]: value
    });
  };

  // Calculate progress percentage towards goal
  const calculateProgress = (current, goal, isReverse = false) => {
    if (!current || !goal) return 0;
    
    // For measurements like waist where lower is better
    if (isReverse) {
      const startValue = sampleMeasurementHistory[0][activeMetric];
      const totalChange = startValue - goal;
      const currentChange = startValue - current;
      return Math.min(100, Math.max(0, (currentChange / totalChange) * 100));
    }
    
    // For measurements like chest where higher is better
    const startValue = sampleMeasurementHistory[0][activeMetric];
    const totalChange = goal - startValue;
    const currentChange = current - startValue;
    return Math.min(100, Math.max(0, (currentChange / totalChange) * 100));
  };

  // Save new measurements
  const saveMeasurements = () => {
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    // Validation
    if (!measurementData.date) {
      setError('Please select a date');
      setIsLoading(false);
      return;
    }
    
    // In a real app, this would be an API call
    setTimeout(() => {
      try {
        // Check if we're updating an existing record
        const existingIndex = measurementHistory.findIndex(
          record => record.date === measurementData.date
        );
        
        let updatedHistory;
        if (existingIndex >= 0) {
          // Update existing record
          updatedHistory = [...measurementHistory];
          updatedHistory[existingIndex] = {...measurementData};
        } else {
          // Add new record and sort by date
          updatedHistory = [...measurementHistory, {...measurementData}];
          updatedHistory.sort((a, b) => new Date(a.date) - new Date(b.date));
        }
        
        setMeasurementHistory(updatedHistory);
        setSuccess('Measurements saved successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          setSuccess('');
        }, 3000);
      } catch (err) {
        setError('Failed to save measurements. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 1000); // Simulate API delay
  };

  // Add new measurement record
  const addNewMeasurement = () => {
    const today = new Date().toISOString().split('T')[0];
    const latestMeasurement = {...measurementHistory[measurementHistory.length - 1]};
    
    setMeasurementData({
      ...latestMeasurement,
      date: today
    });
    
    setActiveView('update');
  };

  // Get metric display name
  const getMetricDisplayName = (metric) => {
    const metricNames = {
      weight: 'Weight',
      bodyFat: 'Body Fat',
      chest: 'Chest',
      waist: 'Waist',
      hips: 'Hips',
      leftArm: 'Left Arm',
      rightArm: 'Right Arm',
      leftThigh: 'Left Thigh',
      rightThigh: 'Right Thigh',
      shoulders: 'Shoulders',
      neck: 'Neck',
      leftCalf: 'Left Calf',
      rightCalf: 'Right Calf'
    };
    
    return metricNames[metric] || metric;
  };

  // Get measurement unit
  const getUnit = (metric) => {
    return metric === 'bodyFat' ? '%' : 'in';
  };

  // Format chart data
  const getChartData = () => {
    return measurementHistory.map(record => ({
      date: formatDate(record.date),
      [activeMetric]: record[activeMetric],
      goal: activeMetric === 'weight' ? physicalGoals.weight :
            activeMetric === 'bodyFat' ? physicalGoals.bodyFat :
            activeMetric === 'chest' ? physicalGoals.chest :
            activeMetric === 'waist' ? physicalGoals.waist :
            activeMetric === 'leftArm' || activeMetric === 'rightArm' ? physicalGoals.arms :
            activeMetric === 'shoulders' ? physicalGoals.shoulders : undefined
    }));
  };

  // Format date for input
  const formatDateForInput = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Measurements</h1>
      <p className="mt-1 text-sm text-gray-500">
        Track your body measurements and progress towards your superhero physique goals
      </p>
      
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="ml-3 text-sm text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'update'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveView('update')}
          >
            Update Measurements
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'history'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveView('history')}
          >
            Measurement History
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeView === 'progress'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveView('progress')}
          >
            Progress Tracker
          </button>
        </nav>
      </div>
      
      {/* Update Measurements View */}
      {activeView === 'update' && (
        <div className="mt-6">
          <div className="bg-white shadow sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <div className="mb-5 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-gray-400" />
                  Measurement Date
                </h3>
                
                <input
                  type="date"
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md"
                  value={formatDateForInput(measurementData.date)}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              
              {/* Weight and Body Fat Section */}
              <div className="border-t border-gray-200 pt-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => toggleSection('weight')}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Scale className="mr-2 h-5 w-5 text-indigo-500" />
                    Weight & Body Composition
                  </h3>
                  {expandedSections.weight ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.weight && (
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                        Weight (lbs)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="weight"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.weight || ''}
                        onChange={(e) => handleInputChange('weight', parseFloat(e.target.value))}
                      />
                      {physicalGoals.weight && (
                        <p className="mt-2 text-sm text-gray-500">
                          Goal: {physicalGoals.weight} lbs
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="bodyFat" className="block text-sm font-medium text-gray-700">
                        Body Fat %
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="bodyFat"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.bodyFat || ''}
                        onChange={(e) => handleInputChange('bodyFat', parseFloat(e.target.value))}
                      />
                      {physicalGoals.bodyFat && (
                        <p className="mt-2 text-sm text-gray-500">
                          Goal: {physicalGoals.bodyFat}%
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Upper Body Measurements */}
              <div className="border-t border-gray-200 pt-5 mt-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => toggleSection('upperBody')}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Ruler className="mr-2 h-5 w-5 text-indigo-500" />
                    Upper Body Measurements
                  </h3>
                  {expandedSections.upperBody ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.upperBody && (
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="chest" className="block text-sm font-medium text-gray-700">
                        Chest (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="chest"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.chest || ''}
                        onChange={(e) => handleInputChange('chest', parseFloat(e.target.value))}
                      />
                      {physicalGoals.chest && (
                        <p className="mt-2 text-sm text-gray-500">
                          Goal: {physicalGoals.chest} inches
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="shoulders" className="block text-sm font-medium text-gray-700">
                        Shoulders (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="shoulders"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.shoulders || ''}
                        onChange={(e) => handleInputChange('shoulders', parseFloat(e.target.value))}
                      />
                      {physicalGoals.shoulders && (
                        <p className="mt-2 text-sm text-gray-500">
                          Goal: {physicalGoals.shoulders} inches
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="leftArm" className="block text-sm font-medium text-gray-700">
                        Left Arm (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="leftArm"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.leftArm || ''}
                        onChange={(e) => handleInputChange('leftArm', parseFloat(e.target.value))}
                      />
                      {physicalGoals.arms && (
                        <p className="mt-2 text-sm text-gray-500">
                          Goal: {physicalGoals.arms} inches
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="rightArm" className="block text-sm font-medium text-gray-700">
                        Right Arm (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="rightArm"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.rightArm || ''}
                        onChange={(e) => handleInputChange('rightArm', parseFloat(e.target.value))}
                      />
                      {physicalGoals.arms && (
                        <p className="mt-2 text-sm text-gray-500">
                          Goal: {physicalGoals.arms} inches
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="waist" className="block text-sm font-medium text-gray-700">
                        Waist (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="waist"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.waist || ''}
                        onChange={(e) => handleInputChange('waist', parseFloat(e.target.value))}
                      />
                      {physicalGoals.waist && (
                        <p className="mt-2 text-sm text-gray-500">
                          Goal: {physicalGoals.waist} inches
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="neck" className="block text-sm font-medium text-gray-700">
                        Neck (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="neck"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.neck || ''}
                        onChange={(e) => handleInputChange('neck', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              {/* Lower Body Measurements */}
              <div className="border-t border-gray-200 pt-5 mt-5">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => toggleSection('lowerBody')}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Ruler className="mr-2 h-5 w-5 text-indigo-500" />
                    Lower Body Measurements
                  </h3>
                  {expandedSections.lowerBody ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.lowerBody && (
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="hips" className="block text-sm font-medium text-gray-700">
                        Hips (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="hips"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.hips || ''}
                        onChange={(e) => handleInputChange('hips', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="leftThigh" className="block text-sm font-medium text-gray-700">
                        Left Thigh (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="leftThigh"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.leftThigh || ''}
                        onChange={(e) => handleInputChange('leftThigh', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="rightThigh" className="block text-sm font-medium text-gray-700">
                        Right Thigh (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="rightThigh"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.rightThigh || ''}
                        onChange={(e) => handleInputChange('rightThigh', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="leftCalf" className="block text-sm font-medium text-gray-700">
                        Left Calf (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="leftCalf"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.leftCalf || ''}
                        onChange={(e) => handleInputChange('leftCalf', parseFloat(e.target.value))}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="rightCalf" className="block text-sm font-medium text-gray-700">
                        Right Calf (inches)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        id="rightCalf"
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                        value={measurementData.rightCalf || ''}
                        onChange={(e) => handleInputChange('rightCalf', parseFloat(e.target.value))}
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={saveMeasurements}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Save Measurements
                </button>
              </div>
              <div className="px-6 py-4 text-xs text-gray-500">
                Click on any row to edit that record
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Progress Tracker View */}
      {activeView === 'progress' && (
        <div className="mt-6">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-indigo-500" />
                Progress Towards Goals
              </h3>
              
              <div className="flex space-x-2">
                <select
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={activeMetric}
                  onChange={(e) => setActiveMetric(e.target.value)}
                >
                  <option value="weight">Weight</option>
                  <option value="bodyFat">Body Fat</option>
                  <option value="chest">Chest</option>
                  <option value="waist">Waist</option>
                  <option value="leftArm">Left Arm</option>
                  <option value="rightArm">Right Arm</option>
                  <option value="shoulders">Shoulders</option>
                </select>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <h4 className="text-md font-medium text-gray-900">
                    {getMetricDisplayName(activeMetric)} Progress
                  </h4>
                  
                  <div className="text-sm text-gray-500 flex items-center">
                    Starting: {measurementHistory[0][activeMetric]} {getUnit(activeMetric)} &nbsp;
                    Current: {measurementHistory[measurementHistory.length - 1][activeMetric]} {getUnit(activeMetric)} &nbsp;
                    Goal: {
                      activeMetric === 'weight' ? physicalGoals.weight :
                      activeMetric === 'bodyFat' ? physicalGoals.bodyFat :
                      activeMetric === 'chest' ? physicalGoals.chest :
                      activeMetric === 'waist' ? physicalGoals.waist :
                      activeMetric === 'leftArm' || activeMetric === 'rightArm' ? physicalGoals.arms :
                      activeMetric === 'shoulders' ? physicalGoals.shoulders : ''
                    } {getUnit(activeMetric)}
                  </div>
                </div>
                
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div>
                      <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-100">
                        {calculateProgress(
                          measurementHistory[measurementHistory.length - 1][activeMetric],
                          activeMetric === 'weight' ? physicalGoals.weight :
                          activeMetric === 'bodyFat' ? physicalGoals.bodyFat :
                          activeMetric === 'chest' ? physicalGoals.chest :
                          activeMetric === 'waist' ? physicalGoals.waist :
                          activeMetric === 'leftArm' || activeMetric === 'rightArm' ? physicalGoals.arms :
                          activeMetric === 'shoulders' ? physicalGoals.shoulders : null,
                          activeMetric === 'weight' || activeMetric === 'bodyFat' || activeMetric === 'waist'
                        ).toFixed(1)}% Complete
                      </span>
                    </div>
                  </div>
                  <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                    <div 
                      style={{ 
                        width: `${calculateProgress(
                          measurementHistory[measurementHistory.length - 1][activeMetric],
                          activeMetric === 'weight' ? physicalGoals.weight :
                          activeMetric === 'bodyFat' ? physicalGoals.bodyFat :
                          activeMetric === 'chest' ? physicalGoals.chest :
                          activeMetric === 'waist' ? physicalGoals.waist :
                          activeMetric === 'leftArm' || activeMetric === 'rightArm' ? physicalGoals.arms :
                          activeMetric === 'shoulders' ? physicalGoals.shoulders : null,
                          activeMetric === 'weight' || activeMetric === 'bodyFat' || activeMetric === 'waist'
                        )}%` 
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getChartData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} ${getUnit(activeMetric)}`} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey={activeMetric} 
                      stroke="#4f46e5" 
                      strokeWidth={2}
                      name={getMetricDisplayName(activeMetric)}
                      activeDot={{ r: 8 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="goal" 
                      stroke="#9ca3af" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Goal"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Weight Progress Card */}
                <div 
                  className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${
                    activeMetric === 'weight' ? 'border-indigo-500' : 'border-gray-200'
                  } cursor-pointer hover:bg-gray-50`}
                  onClick={() => setActiveMetric('weight')}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <Scale className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Weight</dt>
                          <dd className="flex items-baseline">
                            <div className="text-lg font-semibold text-gray-900">
                              {measurementHistory[measurementHistory.length - 1].weight} lbs
                            </div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                              measurementHistory[measurementHistory.length - 1].weight < measurementHistory[measurementHistory.length - 2].weight
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {measurementHistory[measurementHistory.length - 1].weight < measurementHistory[measurementHistory.length - 2].weight ? (
                                <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span className="sr-only">
                                {measurementHistory[measurementHistory.length - 1].weight < measurementHistory[measurementHistory.length - 2].weight
                                  ? 'Decreased'
                                  : 'Increased'
                                } by
                              </span>
                              {Math.abs(measurementHistory[measurementHistory.length - 1].weight - measurementHistory[measurementHistory.length - 2].weight).toFixed(1)} lbs
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Body Fat Progress Card */}
                <div 
                  className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${
                    activeMetric === 'bodyFat' ? 'border-indigo-500' : 'border-gray-200'
                  } cursor-pointer hover:bg-gray-50`}
                  onClick={() => setActiveMetric('bodyFat')}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <span className="h-6 w-6 text-indigo-600 font-bold">%</span>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Body Fat</dt>
                          <dd className="flex items-baseline">
                            <div className="text-lg font-semibold text-gray-900">
                              {measurementHistory[measurementHistory.length - 1].bodyFat}%
                            </div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                              measurementHistory[measurementHistory.length - 1].bodyFat < measurementHistory[measurementHistory.length - 2].bodyFat
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {measurementHistory[measurementHistory.length - 1].bodyFat < measurementHistory[measurementHistory.length - 2].bodyFat ? (
                                <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span className="sr-only">
                                {measurementHistory[measurementHistory.length - 1].bodyFat < measurementHistory[measurementHistory.length - 2].bodyFat
                                  ? 'Decreased'
                                  : 'Increased'
                                } by
                              </span>
                              {Math.abs(measurementHistory[measurementHistory.length - 1].bodyFat - measurementHistory[measurementHistory.length - 2].bodyFat).toFixed(1)}%
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Chest Progress Card */}
                <div 
                  className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${
                    activeMetric === 'chest' ? 'border-indigo-500' : 'border-gray-200'
                  } cursor-pointer hover:bg-gray-50`}
                  onClick={() => setActiveMetric('chest')}
                >
                  <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                        <Ruler className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Chest</dt>
                          <dd className="flex items-baseline">
                            <div className="text-lg font-semibold text-gray-900">
                              {measurementHistory[measurementHistory.length - 1].chest}"
                            </div>
                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                              measurementHistory[measurementHistory.length - 1].chest > measurementHistory[measurementHistory.length - 2].chest
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}>
                              {measurementHistory[measurementHistory.length - 1].chest > measurementHistory[measurementHistory.length - 2].chest ? (
                                <svg className="self-center flex-shrink-0 h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="self-center flex-shrink-0 h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                  <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                              <span className="sr-only">
                                {measurementHistory[measurementHistory.length - 1].chest > measurementHistory[measurementHistory.length - 2].chest
                                  ? 'Increased'
                                  : 'Decreased'
                                } by
                              </span>
                              {Math.abs(measurementHistory[measurementHistory.length - 1].chest - measurementHistory[measurementHistory.length - 2].chest).toFixed(1)}"
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeView === 'history' && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Measurement History</h2>
            <button
              type="button"
              onClick={addNewMeasurement}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Measurement
            </button>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weight
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Body Fat
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chest
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Waist
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Arms (L/R)
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Shoulders
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {measurementHistory.map((record, index) => (
                    <tr key={record.date + '-' + index} className="hover:bg-gray-50 cursor-pointer" onClick={() => {
                      setMeasurementData({...record});
                      setActiveView('update');
                    }}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatDate(record.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.weight} lbs
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.bodyFat}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.chest}"
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.waist}"
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.leftArm}" / {record.rightArm}"
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.shoulders}"
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      
      {/* Footer with link to source file */}
      <div className="mt-8 pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-500 flex justify-between items-center">
          <span>Superhero Fitness Tracker</span>
          <a 
            href="https://github.com/your-repo/superhero-fitness/blob/main/src/pages/measurements.jsx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-indigo-600 hover:text-indigo-800 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            View Source Code
          </a>
        </div>
      </div>
    </div>
  );
};

export default Measurements;