import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Heart, Moon, Smile, Activity, TrendingUp, Plus, ChevronDown, ChevronUp, Clock, ZapOff, Dumbbell, BarChart as BarChartIcon, FileText } from 'lucide-react';

// Sample biomarker data
const sleepData = [
  { date: '03/05', hours: 7.5, quality: 8, deepsleep: 2.1 },
  { date: '03/06', hours: 6.8, quality: 7, deepsleep: 1.8 },
  { date: '03/07', hours: 8.2, quality: 9, deepsleep: 2.5 },
  { date: '03/08', hours: 7.1, quality: 6, deepsleep: 1.9 },
  { date: '03/09', hours: 7.7, quality: 8, deepsleep: 2.2 },
  { date: '03/10', hours: 8.5, quality: 9, deepsleep: 2.7 },
  { date: '03/11', hours: 6.5, quality: 6, deepsleep: 1.6 },
];

const moodData = [
  { date: '03/05', energy: 7, stress: 5, mood: 8 },
  { date: '03/06', energy: 6, stress: 6, mood: 7 },
  { date: '03/07', energy: 8, stress: 4, mood: 9 },
  { date: '03/08', energy: 5, stress: 7, mood: 6 },
  { date: '03/09', energy: 7, stress: 5, mood: 8 },
  { date: '03/10', energy: 9, stress: 3, mood: 9 },
  { date: '03/11', energy: 6, stress: 6, mood: 7 },
];

const vitalData = [
  { date: '03/05', restingHR: 58, bloodPressure: "118/78", hRV: 65 },
  { date: '03/06', restingHR: 60, bloodPressure: "120/80", hRV: 62 },
  { date: '03/07', restingHR: 57, bloodPressure: "117/76", hRV: 68 },
  { date: '03/08', restingHR: 59, bloodPressure: "121/79", hRV: 63 },
  { date: '03/09', restingHR: 56, bloodPressure: "118/75", hRV: 67 },
  { date: '03/10', restingHR: 55, bloodPressure: "116/74", hRV: 70 },
  { date: '03/11', restingHR: 57, bloodPressure: "119/77", hRV: 66 },
];

const strengthData = [
  { date: '02/11', gripStrength: 52, legExtension: 180, benchPress: 225 },
  { date: '02/25', gripStrength: 54, legExtension: 185, benchPress: 230 },
  { date: '03/11', gripStrength: 56, legExtension: 190, benchPress: 235 },
];

const bloodworkData = [
  { date: '01/15', testosterone: 650, cortisol: 15.2, vitaminD: 38 },
  { date: '03/11', testosterone: 720, cortisol: 13.8, vitaminD: 42 },
];

// Recovery scores
const recoveryScores = [
  { date: '03/05', score: 76, sleepQuality: 7, muscleReadiness: 6, energyLevel: 7 },
  { date: '03/06', score: 72, sleepQuality: 6, muscleReadiness: 6, energyLevel: 6 },
  { date: '03/07', score: 85, sleepQuality: 8, muscleReadiness: 7, energyLevel: 8 },
  { date: '03/08', score: 68, sleepQuality: 5, muscleReadiness: 5, energyLevel: 6 },
  { date: '03/09', score: 78, sleepQuality: 7, muscleReadiness: 7, energyLevel: 7 },
  { date: '03/10', score: 88, sleepQuality: 8, muscleReadiness: 8, energyLevel: 9 },
  { date: '03/11', score: 81, sleepQuality: 7, muscleReadiness: 8, energyLevel: 7 },
];

const Biomarkers = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expandedSection, setExpandedSection] = useState('recovery');
  
  // Toggle section expansion
  const toggleSectionExpansion = (section) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  // Get the most recent recovery score
  const latestRecoveryScore = recoveryScores[recoveryScores.length - 1];
  
  // Calculate recovery score class
  const getRecoveryScoreClass = (score) => {
    if (score >= 85) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };
  
  // Function to render the recovery score gauge
  const RecoveryScoreGauge = ({ score }) => {
    // Calculate the angle for the gauge needle
    const angle = (score / 100) * 180 - 90;
    
    return (
      <div className="relative w-48 h-24 mx-auto">
        {/* Gauge background */}
        <div className="absolute top-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full rounded-tl-full rounded-tr-full bg-gray-200"></div>
        </div>
        
        {/* Gauge colored sections */}
        <div className="absolute top-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 left-0 w-1/3 h-full rounded-tl-full bg-red-400"></div>
          <div className="absolute top-0 left-1/3 w-1/3 h-full bg-yellow-400"></div>
          <div className="absolute top-0 right-0 w-1/3 h-full rounded-tr-full bg-green-400"></div>
        </div>
        
        {/* Gauge needle */}
        <div 
          className="absolute top-full left-1/2 w-1 h-16 bg-gray-800 origin-top"
          style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
        ></div>
        
        {/* Score text */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 text-2xl font-bold text-gray-900">
          {score}
        </div>
      </div>
    );
  };
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Biomarkers</h1>
      <p className="mt-1 text-sm text-gray-500">
        Track your health metrics and recovery indicators
      </p>
      
      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'dashboard'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sleep'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('sleep')}
          >
            Sleep
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mood'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('mood')}
          >
            Mood & Energy
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'vitals'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('vitals')}
          >
            Vitals
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'strength'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('strength')}
          >
            Strength Metrics
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'bloodwork'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('bloodwork')}
          >
            Bloodwork
          </button>
        </nav>
      </div>
      
      {/* Add Biomarker Button */}
      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="mr-2 h-4 w-4" />
          Log Biomarkers
        </button>
      </div>
      
      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="mt-4">
          {/* Recovery Score Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSectionExpansion('recovery')}
            >
              <div className="flex items-center">
                <Activity className="h-5 w-5 text-indigo-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">Recovery Score</h3>
              </div>
              <div className="flex items-center">
                <div className={`mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRecoveryScoreClass(latestRecoveryScore.score)}`}>
                  {latestRecoveryScore.score}/100
                </div>
                {expandedSection === 'recovery' ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedSection === 'recovery' && (
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="mb-6">
                  <RecoveryScoreGauge score={latestRecoveryScore.score} />
                </div>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                        <Moon className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Sleep Quality</h4>
                        <div className="mt-1 flex items-center">
                          {[...Array(10)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-2 w-2 rounded-full mx-0.5 ${
                                i < latestRecoveryScore.sleepQuality ? 'bg-indigo-600' : 'bg-gray-300'
                              }`}
                            ></div>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{latestRecoveryScore.sleepQuality}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-100 rounded-md p-2">
                        <Dumbbell className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Muscle Readiness</h4>
                        <div className="mt-1 flex items-center">
                          {[...Array(10)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-2 w-2 rounded-full mx-0.5 ${
                                i < latestRecoveryScore.muscleReadiness ? 'bg-green-600' : 'bg-gray-300'
                              }`}
                            ></div>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{latestRecoveryScore.muscleReadiness}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-amber-100 rounded-md p-2">
                        <TrendingUp className="h-4 w-4 text-amber-600" />
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-gray-900">Energy Level</h4>
                        <div className="mt-1 flex items-center">
                          {[...Array(10)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-2 w-2 rounded-full mx-0.5 ${
                                i < latestRecoveryScore.energyLevel ? 'bg-amber-600' : 'bg-gray-300'
                              }`}
                            ></div>
                          ))}
                          <span className="ml-2 text-sm text-gray-500">{latestRecoveryScore.energyLevel}/10</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Recovery Score Trend</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={recoveryScores}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="score" stroke="#4f46e5" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="mt-6 bg-indigo-50 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FileText className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-indigo-800">Recovery Insights</h3>
                      <div className="mt-2 text-sm text-indigo-700">
                        <p>
                          Your recovery score of <strong>{latestRecoveryScore.score}</strong> indicates you're well-recovered. 
                          Consider scheduling a high-intensity workout today for optimal results. 
                          Your HRV and sleep quality are trending upward, suggesting your recovery protocols are effective.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Sleep Overview Card */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSectionExpansion('sleep')}
            >
              <div className="flex items-center">
                <Moon className="h-5 w-5 text-indigo-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">Sleep Overview</h3>
              </div>
              <div className="flex items-center">
                <div className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {sleepData[sleepData.length - 1].hours} hrs
                </div>
                {expandedSection === 'sleep' ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedSection === 'sleep' && (
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={sleepData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hours" name="Sleep Duration (hrs)" fill="#4f46e5" />
                      <Bar dataKey="deepsleep" name="Deep Sleep (hrs)" fill="#8b5cf6" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-gray-500">Average Sleep</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(sleepData.reduce((acc, day) => acc + day.hours, 0) / sleepData.length).toFixed(1)} hrs
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-gray-500">Average Deep Sleep</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(sleepData.reduce((acc, day) => acc + day.deepsleep, 0) / sleepData.length).toFixed(1)} hrs
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between">
                      <div className="text-sm font-medium text-gray-500">Average Quality</div>
                      <div className="text-lg font-semibold text-gray-900">
                        {(sleepData.reduce((acc, day) => acc + day.quality, 0) / sleepData.length).toFixed(1)}/10
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Heart Rate and HRV Card */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSectionExpansion('hrv')}
            >
              <div className="flex items-center">
                <Heart className="h-5 w-5 text-red-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">Heart Rate & HRV</h3>
              </div>
              <div className="flex items-center">
                <div className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  HR: {vitalData[vitalData.length - 1].restingHR} bpm
                </div>
                {expandedSection === 'hrv' ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedSection === 'hrv' && (
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={vitalData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="restingHR" name="Resting HR (bpm)" stroke="#ef4444" strokeWidth={2} />
                      <Line yAxisId="right" type="monotone" dataKey="hRV" name="HRV (ms)" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <TrendingUp className="h-5 w-5 text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">HRV Insight</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Your HRV has increased from {vitalData[0].hRV}ms to {vitalData[vitalData.length - 1].hRV}ms over the past week, 
                            indicating improved recovery capacity. This correlates with your improved sleep quality.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-red-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Heart className="h-5 w-5 text-red-400" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Resting Heart Rate Insight</h3>
                        <div className="mt-2 text-sm text-red-700">
                          <p>
                            Your resting heart rate has decreased from {vitalData[0].restingHR}bpm to {vitalData[vitalData.length - 1].restingHR}bpm, 
                            which is excellent. Continued cardiovascular training is improving your cardiac efficiency.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Mood & Energy Card */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSectionExpansion('mood')}
            >
              <div className="flex items-center">
                <Smile className="h-5 w-5 text-yellow-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">Mood & Energy</h3>
              </div>
              <div className="flex items-center">
                <div className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Energy: {moodData[moodData.length - 1].energy}/10
                </div>
                {expandedSection === 'mood' ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedSection === 'mood' && (
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={moodData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[0, 10]} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="energy" name="Energy (1-10)" stroke="#f59e0b" strokeWidth={2} />
                      <Line type="monotone" dataKey="mood" name="Mood (1-10)" stroke="#10b981" strokeWidth={2} />
                      <Line type="monotone" dataKey="stress" name="Stress (1-10)" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Energy Levels</h4>
                    <div className="flex items-center">
                      <ZapOff className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="relative w-full bg-gray-200 h-2 rounded-full">
                        <div 
                          className="absolute top-0 left-0 h-full bg-amber-500 rounded-full"
                          style={{ width: `${moodData[moodData.length - 1].energy * 10}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {moodData[moodData.length - 1].energy}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {moodData[moodData.length - 1].energy >= 8 
                        ? 'Excellent energy levels today!' 
                        : moodData[moodData.length - 1].energy >= 6 
                        ? 'Moderate energy levels today.' 
                        : 'Lower energy today. Consider active recovery.'}
                    </p>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Mood</h4>
                    <div className="flex items-center">
                      <Smile className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="relative w-full bg-gray-200 h-2 rounded-full">
                        <div 
                          className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                          style={{ width: `${moodData[moodData.length - 1].mood * 10}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {moodData[moodData.length - 1].mood}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {moodData[moodData.length - 1].mood >= 8 
                        ? 'Great mood today!' 
                        : moodData[moodData.length - 1].mood >= 6 
                        ? 'Average mood today.' 
                        : 'Lower mood today. Consider some mood-boosting activities.'}
                    </p>
                  </div>
                  
                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Stress</h4>
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-gray-400 mr-2" />
                      <div className="relative w-full bg-gray-200 h-2 rounded-full">
                        <div 
                          className="absolute top-0 left-0 h-full bg-red-500 rounded-full"
                          style={{ width: `${moodData[moodData.length - 1].stress * 10}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {moodData[moodData.length - 1].stress}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500">
                      {moodData[moodData.length - 1].stress <= 3
                        ? 'Very low stress today!' 
                        : moodData[moodData.length - 1].stress <= 6 
                        ? 'Moderate stress levels today.' 
                        : 'Higher stress today. Consider relaxation techniques.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Strength Metrics Card */}
          <div className="mt-6 bg-white overflow-hidden shadow rounded-lg">
            <div 
              className="px-4 py-5 sm:px-6 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSectionExpansion('strength')}
            >
              <div className="flex items-center">
                <Dumbbell className="h-5 w-5 text-indigo-500 mr-2" />
                <h3 className="text-lg leading-6 font-medium text-gray-900">Strength Metrics</h3>
              </div>
              <div className="flex items-center">
                <div className="mr-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Grip: {strengthData[strengthData.length - 1].gripStrength} kg
                </div>
                {expandedSection === 'strength' ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>
            
            {expandedSection === 'strength' && (
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="h-60">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={strengthData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="gripStrength" name="Grip Strength (kg)" fill="#4f46e5" />
                      <Bar dataKey="legExtension" name="Leg Extension (kg)" fill="#10b981" />
                      <Bar dataKey="benchPress" name="Bench Press (lbs)" fill="#f59e0b" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="bg-indigo-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900">Grip Strength</h4>
                    <div className="mt-1 text-2xl font-semibold text-indigo-600">
                      {strengthData[strengthData.length - 1].gripStrength} kg
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {strengthData[0].gripStrength < strengthData[strengthData.length - 1].gripStrength 
                        ? `↑ ${strengthData[strengthData.length - 1].gripStrength - strengthData[0].gripStrength} kg increase` 
                        : `↓ ${strengthData[0].gripStrength - strengthData[strengthData.length - 1].gripStrength} kg decrease`}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900">Leg Extension</h4>
                    <div className="mt-1 text-2xl font-semibold text-green-600">
                      {strengthData[strengthData.length - 1].legExtension} kg
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {strengthData[0].legExtension < strengthData[strengthData.length - 1].legExtension 
                        ? `↑ ${strengthData[strengthData.length - 1].legExtension - strengthData[0].legExtension} kg increase` 
                        : `↓ ${strengthData[0].legExtension - strengthData[strengthData.length - 1].legExtension} kg decrease`}
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900">Bench Press</h4>
                    <div className="mt-1 text-2xl font-semibold text-amber-600">
                      {strengthData[strengthData.length - 1].benchPress} lbs
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      {strengthData[0].benchPress < strengthData[strengthData.length - 1].benchPress 
                        ? `↑ ${strengthData[strengthData.length - 1].benchPress - strengthData[0].benchPress} lbs increase` 
                        : `↓ ${strengthData[0].benchPress - strengthData[strengthData.length - 1].benchPress} lbs decrease`}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Sleep Tab */}
      {activeTab === 'sleep' && (
        <div className="mt-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <Moon className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Sleep Tracking</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                  <select
                    id="date-range"
                    name="date-range"
                    className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    <option>Last 7 days</option>
                    <option>Last 14 days</option>
                    <option>Last 30 days</option>
                    <option>Custom range</option>
                  </select>
                </div>
              </div>
              
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={sleepData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="hours" name="Sleep Duration (hrs)" stroke="#4f46e5" strokeWidth={2} />
                    <Line type="monotone" dataKey="quality" name="Sleep Quality (1-10)" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="deepsleep" name="Deep Sleep (hrs)" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 text-indigo-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Average Sleep Duration</h4>
                  </div>
                  <div className="mt-2 text-3xl font-bold text-indigo-600">
                    {(sleepData.reduce((acc, day) => acc + day.hours, 0) / sleepData.length).toFixed(1)}
                    <span className="text-lg ml-1">hrs</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {(sleepData.reduce((acc, day) => acc + day.hours, 0) / sleepData.length) >= 8 
                      ? 'Excellent sleep duration!' 
                      : (sleepData.reduce((acc, day) => acc + day.hours, 0) / sleepData.length) >= 7 
                      ? 'Good sleep duration.' 
                      : 'Could improve sleep duration.'}
                  </p>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <Moon className="h-5 w-5 text-purple-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Average Deep Sleep</h4>
                  </div>
                  <div className="mt-2 text-3xl font-bold text-purple-600">
                    {(sleepData.reduce((acc, day) => acc + day.deepsleep, 0) / sleepData.length).toFixed(1)}
                    <span className="text-lg ml-1">hrs</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {(sleepData.reduce((acc, day) => acc + day.deepsleep, 0) / sleepData.length) >= 2 
                      ? 'Excellent deep sleep!' 
                      : (sleepData.reduce((acc, day) => acc + day.deepsleep, 0) / sleepData.length) >= 1.5 
                      ? 'Good deep sleep.' 
                      : 'Could improve deep sleep.'}
                  </p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center">
                    <BarChartIcon className="h-5 w-5 text-green-500 mr-2" />
                    <h4 className="text-sm font-medium text-gray-900">Sleep Quality</h4>
                  </div>
                  <div className="mt-2 text-3xl font-bold text-green-600">
                    {(sleepData.reduce((acc, day) => acc + day.quality, 0) / sleepData.length).toFixed(1)}
                    <span className="text-lg ml-1">/10</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    {(sleepData.reduce((acc, day) => acc + day.quality, 0) / sleepData.length) >= 8 
                      ? 'Excellent sleep quality!' 
                      : (sleepData.reduce((acc, day) => acc + day.quality, 0) / sleepData.length) >= 6 
                      ? 'Good sleep quality.' 
                      : 'Could improve sleep quality.'}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 bg-blue-50 p-4 rounded-md">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">Sleep Insights</h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Your sleep data shows an improvement trend this week. With an average of 
                        {(sleepData.reduce((acc, day) => acc + day.hours, 0) / sleepData.length).toFixed(1)} hours
                        and {(sleepData.reduce((acc, day) => acc + day.deepsleep, 0) / sleepData.length).toFixed(1)} hours 
                        of deep sleep, you're getting good recovery. This correlates with your improving strength metrics
                        and recovery scores. Try to maintain your current sleep schedule for optimal results.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Other tabs would be implemented similarly with their respective data and visualizations */}
      {activeTab === 'mood' && (
        <div className="mt-6 p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Mood & Energy Tracking</h3>
          <p>Detailed mood and energy tracking interface would go here.</p>
        </div>
      )}
      
      {activeTab === 'vitals' && (
        <div className="mt-6 p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Vitals Tracking</h3>
          <p>Detailed vitals tracking interface would go here.</p>
        </div>
      )}
      
      {activeTab === 'strength' && (
        <div className="mt-6 p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Strength Metrics</h3>
          <p>Detailed strength metrics tracking interface would go here.</p>
        </div>
      )}
      
      {activeTab === 'bloodwork' && (
        <div className="mt-6 p-6 bg-white shadow rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Bloodwork Results</h3>
          <p>Detailed bloodwork results tracking interface would go here.</p>
        </div>
      )}
      
      {/* Add Biomarker Modal */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowAddModal(false)}
            ></div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Log Today's Biomarkers
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="biomarker-type" className="block text-sm font-medium text-gray-700">
                          Biomarker Type
                        </label>
                        <select
                          id="biomarker-type"
                          name="biomarker-type"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        >
                          <option>Sleep</option>
                          <option>Mood & Energy</option>
                          <option>Heart Rate & HRV</option>
                          <option>Blood Pressure</option>
                          <option>Recovery Score</option>
                          <option>Strength Metrics</option>
                          <option>Bloodwork</option>
                        </select>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label htmlFor="sleep-hours" className="block text-sm font-medium text-gray-700">
                            Hours of Sleep
                          </label>
                          <input
                            type="number"
                            name="sleep-hours"
                            id="sleep-hours"
                            step="0.1"
                            min="0"
                            max="24"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="7.5"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="deep-sleep" className="block text-sm font-medium text-gray-700">
                            Deep Sleep (hours)
                          </label>
                          <input
                            type="number"
                            name="deep-sleep"
                            id="deep-sleep"
                            step="0.1"
                            min="0"
                            max="24"
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="2.0"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="sleep-quality" className="block text-sm font-medium text-gray-700">
                            Sleep Quality (1-10)
                          </label>
                          <input
                            type="range"
                            name="sleep-quality"
                            id="sleep-quality"
                            min="1"
                            max="10"
                            className="mt-1 block w-full"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>1</span>
                            <span>5</span>
                            <span>10</span>
                          </div>
                        </div>
                        
                        <div>
                          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                            Notes
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder="Any notes about your sleep (e.g., took melatonin, woke up during the night, etc.)"
                          ></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Biomarkers;