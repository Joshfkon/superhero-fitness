import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Ruler, Scale, Target, Save } from 'lucide-react';
import { profileService } from '../services';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'male',
    heightFeet: '',
    heightInches: '',
    height: '',
    weight: '',
    wristSize: '',
    chest: '',
    shoulders: '',
    biceps: '',
    forearms: '',
    waist: '',
    hips: '',
    thighs: '',
    calves: '',
    targetChest: '',
    targetShoulders: '',
    targetBiceps: '',
    targetForearms: '',
    targetWaist: '',
    targetThighs: '',
    targetCalves: '',
    bodyFatGoal: 10,
    experienceLevel: 'intermediate',
    workoutsPerWeek: 4,
  });

  useEffect(() => {
    if (formData.heightFeet && formData.heightInches) {
      const totalInches = (parseInt(formData.heightFeet) * 12) + parseInt(formData.heightInches);
      setFormData(prev => ({ ...prev, height: totalInches.toString() }));
    }
  }, [formData.heightFeet, formData.heightInches]);

  useEffect(() => {
    if (formData.height && (!formData.heightFeet || !formData.heightInches)) {
      const feet = Math.floor(parseInt(formData.height) / 12);
      const inches = parseInt(formData.height) % 12;
      setFormData(prev => ({ ...prev, heightFeet: feet.toString(), heightInches: inches.toString() }));
    }
  }, [formData.height]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        console.log('Fetching profile data...');
        const response = await profileService.getProfile();
        console.log('Profile data received:', response);
        if (response?.profile) {
          const profile = response.profile;
          setFormData(prev => ({
            ...prev,
            age: profile.age?.toString() || '',
            gender: profile.gender || 'male',
            height: profile.height?.toString() || '',
            weight: profile.weight?.toString() || '',
            wristSize: profile.wristSize?.toString() || '',
            chest: profile.measurements?.chest?.toString() || '',
            shoulders: profile.measurements?.shoulders?.toString() || '',
            biceps: profile.measurements?.biceps?.toString() || '',
            forearms: profile.measurements?.forearms?.toString() || '',
            waist: profile.measurements?.waist?.toString() || '',
            hips: profile.measurements?.hips?.toString() || '',
            thighs: profile.measurements?.thighs?.toString() || '',
            calves: profile.measurements?.calves?.toString() || '',
            targetChest: profile.targetMeasurements?.chest?.toString() || '',
            targetShoulders: profile.targetMeasurements?.shoulders?.toString() || '',
            targetBiceps: profile.targetMeasurements?.biceps?.toString() || '',
            targetForearms: profile.targetMeasurements?.forearms?.toString() || '',
            targetWaist: profile.targetMeasurements?.waist?.toString() || '',
            targetThighs: profile.targetMeasurements?.thighs?.toString() || '',
            targetCalves: profile.targetMeasurements?.calves?.toString() || '',
            bodyFatGoal: profile.bodyFatGoal || 10,
            experienceLevel: profile.experienceLevel || 'intermediate',
            workoutsPerWeek: profile.workoutsPerWeek || 4,
          }));

          if (profile.goals?.length > 0) {
            setTimeout(() => {
              profile.goals.forEach(goal => {
                const checkbox = document.getElementById(`goal-${goal}`);
                if (checkbox) checkbox.checked = true;
              });
            }, 0);
          }
        } else {
          console.log('No profile data found in response');
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        // More detailed error information for debugging
        if (err.response) {
          console.error("Response status:", err.response.status);
          console.error("Response data:", err.response.data);
        } else if (err.request) {
          console.error("Request was made but no response received");
        } else {
          console.error("Error message:", err.message);
        }
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateIdealMeasurements = () => {
    if (!formData.wristSize) return null;
    const wrist = parseFloat(formData.wristSize);
    return {
      chest: (wrist * 6.5).toFixed(1),
      shoulders: (wrist * 7.5).toFixed(1),
      biceps: (wrist * 2.3).toFixed(1),
      forearms: (wrist * 1.8).toFixed(1),
      waist: (wrist * 4.5).toFixed(1),
      thighs: (wrist * 3.5).toFixed(1),
      calves: (wrist * 2.3).toFixed(1),
    };
  };

  const idealMeasurements = calculateIdealMeasurements();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const profileData = {
        age: parseInt(formData.age) || undefined,
        gender: formData.gender,
        height: parseFloat(formData.height) || undefined,
        weight: parseFloat(formData.weight) || undefined,
        wristSize: parseFloat(formData.wristSize) || undefined,
        measurements: {
          chest: parseFloat(formData.chest) || undefined,
          shoulders: parseFloat(formData.shoulders) || undefined,
          biceps: parseFloat(formData.biceps) || undefined,
          forearms: parseFloat(formData.forearms) || undefined,
          waist: parseFloat(formData.waist) || undefined, // Fixed: was using wristSize
          hips: parseFloat(formData.hips) || undefined,
          thighs: parseFloat(formData.thighs) || undefined,
          calves: parseFloat(formData.calves) || undefined
        },
        targetMeasurements: {
          chest: parseFloat(formData.targetChest) || undefined,
          shoulders: parseFloat(formData.targetShoulders) || undefined,
          biceps: parseFloat(formData.targetBiceps) || undefined,
          forearms: parseFloat(formData.targetForearms) || undefined,
          waist: parseFloat(formData.targetWaist) || undefined,
          thighs: parseFloat(formData.targetThighs) || undefined,
          calves: parseFloat(formData.targetCalves) || undefined
        },
        experienceLevel: formData.experienceLevel,
        workoutsPerWeek: parseInt(formData.workoutsPerWeek) || undefined,
        bodyFatGoal: parseFloat(formData.bodyFatGoal) || undefined, // Changed to parseFloat for decimal support
        notes: ''
      };

      const goalCheckboxes = document.querySelectorAll('input[name="goals"]:checked');
      profileData.goals = Array.from(goalCheckboxes).map(checkbox => checkbox.id.replace('goal-', ''));

      console.log('Saving profile data:', profileData); // For debugging
      
      await profileService.createOrUpdateProfile(profileData);
      setIsLoading(false);
      alert('Profile saved successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save profile:', error);
      setIsLoading(false);
      setError(error.message || 'Failed to save profile. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Profile Setup</h1>
      <p className="mt-1 text-sm text-gray-500">Set up your profile and determine your ideal superhero measurements</p>

      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-8">
        {/* Basic Information */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <User className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  name="age"
                  id="age"
                  min="16"
                  max="99"
                  value={formData.age}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="heightFeet" className="block text-sm font-medium text-gray-700">Height</label>
                <div className="mt-1 flex space-x-2">
                  <select
                    name="heightFeet"
                    id="heightFeet"
                    value={formData.heightFeet}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Feet</option>
                    {[4, 5, 6, 7].map(ft => <option key={ft} value={ft}>{ft} ft</option>)}
                  </select>
                  <select
                    name="heightInches"
                    id="heightInches"
                    value={formData.heightInches}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="">Inches</option>
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i} value={i}>{i} in</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">Weight (lbs)</label>
                <input
                  type="number"
                  name="weight"
                  id="weight"
                  step="0.1"
                  min="80"
                  max="400"
                  value={formData.weight}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="wristSize" className="block text-sm font-medium text-gray-700">Wrist Size (inches)</label>
                <input
                  type="number"
                  name="wristSize"
                  id="wristSize"
                  step="0.1"
                  min="5"
                  max="10"
                  value={formData.wristSize}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                />
                <p className="mt-1 text-xs text-indigo-600">* Used to calculate superhero proportions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Current Measurements */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Ruler className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Current Measurements</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {[
                { name: 'chest', label: 'Chest', min: 30, max: 60 },
                { name: 'shoulders', label: 'Shoulders', min: 36, max: 65 },
                { name: 'biceps', label: 'Biceps', min: 10, max: 25 },
                { name: 'forearms', label: 'Forearms', min: 8, max: 18 },
                { name: 'waist', label: 'Waist', min: 24, max: 50 },
                { name: 'hips', label: 'Hips', min: 30, max: 60 },
                { name: 'thighs', label: 'Thighs', min: 18, max: 35 },
                { name: 'calves', label: 'Calves', min: 12, max: 24 },
              ].map(field => (
                <div key={field.name} className="sm:col-span-2">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label} (inches)</label>
                  <input
                    type="number"
                    name={field.name}
                    id={field.name}
                    step="0.1"
                    min={field.min}
                    max={field.max}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                  {idealMeasurements && field.name !== 'hips' && (
                    <p className="mt-1 text-xs text-indigo-600">
                      Target: {idealMeasurements[field.name]}" for superhero proportions
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Target Measurements */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Target className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Target Measurements</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="mb-4">
              <p className="text-sm text-gray-500">
                Set your target measurements. Superhero proportions are provided as a reference.
              </p>
              {idealMeasurements && (
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    targetChest: idealMeasurements.chest,
                    targetShoulders: idealMeasurements.shoulders,
                    targetBiceps: idealMeasurements.biceps,
                    targetForearms: idealMeasurements.forearms,
                    targetWaist: idealMeasurements.waist,
                    targetThighs: idealMeasurements.thighs,
                    targetCalves: idealMeasurements.calves
                  }))}
                  className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                >
                  Use Superhero Proportions
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {[
                { name: 'targetChest', label: 'Chest', min: 30, max: 60 },
                { name: 'targetShoulders', label: 'Shoulders', min: 36, max: 65 },
                { name: 'targetBiceps', label: 'Biceps', min: 10, max: 25 },
                { name: 'targetForearms', label: 'Forearms', min: 8, max: 18 },
                { name: 'targetWaist', label: 'Waist', min: 24, max: 50 },
                { name: 'targetThighs', label: 'Thighs', min: 18, max: 35 },
                { name: 'targetCalves', label: 'Calves', min: 12, max: 24 },
              ].map(field => (
                <div key={field.name} className="sm:col-span-2">
                  <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">{field.label} (inches)</label>
                  <input
                    type="number"
                    name={field.name}
                    id={field.name}
                    step="0.1"
                    min={field.min}
                    max={field.max}
                    value={formData[field.name]}
                    onChange={handleChange}
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body Composition */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Scale className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Body Composition</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="sm:col-span-3">
              <label htmlFor="bodyFatGoal" className="block text-sm font-medium text-gray-700">Body Fat Goal (%)</label>
              <div className="mt-1 flex items-center">
                <input
                  type="range"
                  name="bodyFatGoal"
                  id="bodyFatGoal"
                  min="6"
                  max="45"
                  step="0.1" // Added step for decimal precision
                  value={formData.bodyFatGoal}
                  onChange={handleChange}
                  className="w-full h-2 bg-indigo-100 rounded-lg cursor-pointer"
                />
                <span className="ml-4 text-sm font-medium text-gray-900 w-12">
                  {parseFloat(formData.bodyFatGoal).toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>6%</span>
                <span>15%</span>
                <span>25%</span>
                <span>35%</span>
                <span>45%</span>
              </div>
              {formData.gender === 'male' && formData.bodyFatGoal < 8 && (
                <p className="mt-2 text-xs text-amber-600">
                  Note: Body fat below 8% is difficult to maintain and may impact health.
                </p>
              )}
              {formData.gender === 'female' && formData.bodyFatGoal < 12 && (
                <p className="mt-2 text-xs text-amber-600">
                  Note: Body fat below 12% for women is difficult to maintain and may impact health.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Training Experience */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex items-center">
            <Target className="h-5 w-5 text-indigo-500 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Training Experience</h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">Experience Level</label>
                <select
                  id="experienceLevel"
                  name="experienceLevel"
                  value={formData.experienceLevel}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  <option value="beginner">Beginner (0-1 year)</option>
                  <option value="intermediate">Intermediate (1-3 years)</option>
                  <option value="advanced">Advanced (3-5 years)</option>
                  <option value="expert">Expert (5+ years)</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label htmlFor="workoutsPerWeek" className="block text-sm font-medium text-gray-700">Workouts Per Week</label>
                <select
                  id="workoutsPerWeek"
                  name="workoutsPerWeek"
                  value={formData.workoutsPerWeek}
                  onChange={handleChange}
                  className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                >
                  {[2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} workouts per week</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-6">
                <fieldset>
                  <legend className="text-sm font-medium text-gray-700">Primary Goals</legend>
                  <div className="mt-2 space-y-2">
                    {[
                      { id: 'muscle', label: 'Build Muscle Mass' },
                      { id: 'strength', label: 'Increase Strength' },
                      { id: 'fat', label: 'Lose Body Fat' },
                      { id: 'health', label: 'Improve Overall Health' },
                    ].map(goal => (
                      <div key={goal.id} className="flex items-center">
                        <input
                          id={`goal-${goal.id}`}
                          name="goals"
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`goal-${goal.id}`} className="ml-3 text-sm text-gray-700">{goal.label}</label>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                Save Profile
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSetup;