// Import modifications to DataImport.jsx

import React, { useState } from 'react';
import { Upload, FileText, Check, X, AlertCircle, ArrowRight, Heart, Moon, Activity } from 'lucide-react';
import { appleHealthService } from '../services/appleHealthService';

// We need to add the Scale icon that's referenced in the code
import { Scale } from 'lucide-react';

// Add this to your existing imports in DataImport.jsx

const DataImport = () => {
  // Add this state alongside your existing state variables
  const [activeTab, setActiveTab] = useState('strong');
  const [uploadStage, setUploadStage] = useState('upload');
  const [file, setFile] = useState(null);
  const [importResults, setImportResults] = useState(null);
  
  // Add "applehealth" to your existing tabs logic
  
  // Handle Apple Health file selection
  const handleAppleHealthFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStage('mapping');
    }
  };

  // Handle Strong file selection
  const handleStrongFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStage('mapping');
    }
  };

  // Handle Lose It file selection
  const handleLoseItFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStage('mapping');
    }
  };
  
  // Process Apple Health import
  const handleAppleHealthImport = async (e) => {
    e.preventDefault();
    setUploadStage('processing');
    
    try {
      // Parse the Apple Health export zip file
      const healthData = await appleHealthService.parseExport(file);
      
      // Import the parsed data
      const results = await appleHealthService.importHealthData(healthData);
      
      setImportResults(results);
      setUploadStage('complete');
    } catch (err) {
      console.error('Error importing Apple Health data:', err);
      setUploadStage('error');
    }
  };
  
  // Reset form
  const handleReset = () => {
    setFile(null);
    setUploadStage('upload');
    setImportResults(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Data Import</h1>
      <p className="mt-1 text-sm text-gray-500">
        Import your workout history, nutrition data, and health metrics from various apps
      </p>

      {/* Add Apple Health to the tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'strong'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('strong')}
          >
            Strong App (Workouts)
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'loseit'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('loseit')}
          >
            Lose It (Nutrition)
          </button>
          {/* New Tab for Apple Health */}
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'applehealth'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('applehealth')}
          >
            Apple Health (Metrics)
          </button>
        </nav>
      </div>

      {/* Content for Strong App import */}
      {activeTab === 'strong' && (
        <div className="mt-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Upload Stage */}
              {uploadStage === 'upload' && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Import workout data from Strong App
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Export your workout history from the Strong app and upload the CSV file here.
                      We'll import your exercises, sets, reps, weights, and other workout details.
                    </p>
                  </div>
                  <div className="mt-5">
                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="strong-file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="strong-file-upload"
                              name="strong-file-upload"
                              type="file"
                              className="sr-only"
                              accept=".csv"
                              onChange={handleStrongFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">CSV file exported from Strong app</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mapping, Processing, Complete, and Error stages would be similar to Apple Health */}
              {/* Just showing upload stage for now */}
            </div>
          </div>
          
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                How to export data from Strong app
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Follow these steps to export your workout data from the Strong app:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li>Open the Strong app on your device</li>
                  <li>Go to the Profile tab</li>
                  <li>Tap on "Settings" (gear icon)</li>
                  <li>Scroll down and tap on "Export Data"</li>
                  <li>Select CSV format and choose email or other export method</li>
                  <li>Upload the CSV file here</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content for Lose It import */}
      {activeTab === 'loseit' && (
        <div className="mt-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Upload Stage */}
              {uploadStage === 'upload' && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Import nutrition data from Lose It
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Export your nutrition logs from the Lose It app and upload the CSV file here.
                      We'll import your calorie intake, macronutrients, meals, and weight measurements.
                    </p>
                  </div>
                  <div className="mt-5">
                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="loseit-file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="loseit-file-upload"
                              name="loseit-file-upload"
                              type="file"
                              className="sr-only"
                              accept=".csv"
                              onChange={handleLoseItFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">CSV file exported from Lose It app</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mapping, Processing, Complete, and Error stages would be similar to Apple Health */}
              {/* Just showing upload stage for now */}
            </div>
          </div>
          
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                How to export data from Lose It
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Follow these steps to export your nutrition data from the Lose It app:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li>Log in to your Lose It account on the website (app export not available)</li>
                  <li>Click on "Account" in the top right corner</li>
                  <li>Select "Export Data"</li>
                  <li>Choose the date range you want to export</li>
                  <li>Download the CSV file</li>
                  <li>Upload the CSV file here</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content for Apple Health import */}
      {activeTab === 'applehealth' && (
        <div className="mt-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              {/* Upload Stage */}
              {uploadStage === 'upload' && (
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Import health data from Apple Health
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Export your health data from the Apple Health app and upload the ZIP file here.
                      We'll import your sleep, heart rate, steps, workouts, and other metrics.
                    </p>
                  </div>
                  <div className="mt-5">
                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="apple-health-file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="apple-health-file-upload"
                              name="apple-health-file-upload"
                              type="file"
                              className="sr-only"
                              accept=".zip"
                              onChange={handleAppleHealthFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">ZIP file exported from Apple Health app</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mapping Stage */}
              {uploadStage === 'mapping' && (
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Import Apple Health Data
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FileText className="mr-1 h-4 w-4" />
                      {file && file.name}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      We'll import the following data from your Apple Health export:
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Data Types</h4>
                      
                      <ul className="space-y-3">
                        <li className="flex items-center text-sm text-gray-600">
                          <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                          <span>Sleep metrics (hours, estimated quality)</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Heart className="h-5 w-5 text-red-500 mr-2" />
                          <span>Heart rate data (resting heart rate, HRV)</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Activity className="h-5 w-5 text-green-500 mr-2" />
                          <span>Activity (steps, workouts, energy expenditure)</span>
                        </li>
                        <li className="flex items-center text-sm text-gray-600">
                          <Scale className="h-5 w-5 text-blue-500 mr-2" />
                          <span>Body metrics (weight, body fat percentage if available)</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="mt-5 flex space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleAppleHealthImport}
                      >
                        Import Data
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleReset}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Processing Stage */}
              {uploadStage === 'processing' && (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
                  <h3 className="mt-4 text-lg font-medium text-gray-900">Processing Health Data</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    This may take a moment depending on the size of your export file...
                  </p>
                </div>
              )}

              {/* Complete Stage */}
              {uploadStage === 'complete' && (
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                      <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Import Successful!
                      </h3>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>
                          Your Apple Health data has been successfully imported. You can view your health metrics
                          in the Biomarkers section.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 bg-green-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-green-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Import Summary</h3>
                        <div className="mt-2 text-sm text-green-700">
                          {importResults && (
                            <ul className="list-disc pl-5 space-y-1">
                              <li>{importResults.imported.sleep} sleep records imported</li>
                              <li>{importResults.imported.heartRate} heart rate records imported</li>
                              <li>{importResults.imported.steps} daily step counts imported</li>
                              <li>{importResults.imported.workouts} workouts imported</li>
                              <li>{importResults.imported.weight} weight measurements imported</li>
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={handleReset}
                    >
                      Import More Data
                    </button>
                  </div>
                </div>
              )}

              {/* Error Stage */}
              {uploadStage === 'error' && (
                <div>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-red-100 rounded-md p-2">
                      <X className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Import Failed
                      </h3>
                      <div className="mt-2 text-sm text-gray-500">
                        <p>
                          There was an error importing your Apple Health data. Please check your export file and try again.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5 bg-red-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Error Details</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            We couldn't process the Apple Health export file. Make sure you're exporting from the 
                            Apple Health app correctly and that the ZIP file isn't corrupted.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-5">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={handleReset}
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                How to export data from Apple Health
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Follow these steps to export your health data from the Apple Health app:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li>Open the Health app on your iPhone</li>
                  <li>Tap on your profile picture in the top-right corner</li>
                  <li>Scroll down and tap on "Export All Health Data"</li>
                  <li>Wait for the export to be prepared (this may take several minutes)</li>
                  <li>Choose a method to share the ZIP file (email, AirDrop, Files, etc.)</li>
                  <li>Upload the ZIP file here</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataImport;