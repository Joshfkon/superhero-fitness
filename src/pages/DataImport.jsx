import React, { useState } from 'react';
import { Upload, FileText, Check, X, AlertCircle, ArrowRight } from 'lucide-react';

const DataImport = () => {
  const [activeTab, setActiveTab] = useState('strong');
  const [uploadStage, setUploadStage] = useState('upload'); // upload, mapping, complete, error
  const [file, setFile] = useState(null);
  
  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadStage('mapping');
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would process the file and map the data
    // For demonstration, we'll just move to the complete stage
    setUploadStage('complete');
  };
  
  // Reset the form
  const handleReset = () => {
    setFile(null);
    setUploadStage('upload');
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Data Import</h1>
      <p className="mt-1 text-sm text-gray-500">
        Import your workout history from Strong app and nutrition data from Lose It
      </p>

      {/* Tabs */}
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
                    Import workout data from Strong
                  </h3>
                  <div className="mt-2 max-w-xl text-sm text-gray-500">
                    <p>
                      Export your workout data from the Strong app and upload the CSV file here.
                      We'll map your exercises, sets, reps, and weights to our system.
                    </p>
                  </div>
                  <div className="mt-5">
                    <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-gray-400" />
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".csv"
                              onChange={handleFileChange}
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

              {/* Mapping Stage */}
              {uploadStage === 'mapping' && (
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Map your Strong data
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <FileText className="mr-1 h-4 w-4" />
                      {file && file.name}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-4">
                      We've detected the following data from your Strong export. Please confirm the mapping:
                    </p>
                    
                    <div className="bg-gray-50 p-4 rounded-md">
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Data Preview</h4>
                      
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Strong Field
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Our Field
                              </th>
                              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Sample Data
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Date</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">workout_date</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2023-02-15</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Exercise</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">exercise_name</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Bench Press</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Weight</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">weight</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">225 lbs</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Reps</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">reps</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                            </tr>
                            <tr>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Sets</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">sets</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">4</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    <div className="mt-5 flex space-x-3">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleSubmit}
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
                          Your workout data has been successfully imported. We've mapped all your exercises
                          and training history to our system.
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
                          <ul className="list-disc pl-5 space-y-1">
                            <li>Imported 86 workouts from 2022-01-01 to 2023-02-15</li>
                            <li>Mapped 32 unique exercises</li>
                            <li>Imported 1,240 sets with weights and reps</li>
                          </ul>
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
                          There was an error importing your workout data. Please check your file format and try again.
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
                            We couldn't parse the CSV file. Please make sure you're exporting from the latest version
                            of the Strong app and that the file is not corrupted.
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
                How to export data from Strong app
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Follow these steps to export your workout data from the Strong app:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li>Open the Strong app on your device</li>
                  <li>Tap the "More" tab in the bottom navigation</li>
                  <li>Select "Settings" from the menu</li>
                  <li>Scroll down and tap "Export Data"</li>
                  <li>Choose "CSV" as the export format</li>
                  <li>Share the file to your device or email it to yourself</li>
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
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Import nutrition data from Lose It
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Export your nutrition data from the Lose It app and upload the CSV file here.
                  We'll map your meals, calories, and macros to our system.
                </p>
              </div>
              <div className="mt-5">
                <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="loseit-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="loseit-upload"
                          name="loseit-upload"
                          type="file"
                          className="sr-only"
                          accept=".csv"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">CSV file exported from Lose It app</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                How to export data from Lose It app
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>
                  Follow these steps to export your nutrition data from the Lose It app:
                </p>
                <ol className="list-decimal pl-5 mt-2 space-y-2">
                  <li>Log in to the Lose It website (app.loseit.com)</li>
                  <li>Click on your username in the top right corner</li>
                  <li>Select "Settings" from the dropdown menu</li>
                  <li>Scroll down to "Export Data" section</li>
                  <li>Choose "Export to CSV" and download the file</li>
                  <li>Upload the CSV file here</li>
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