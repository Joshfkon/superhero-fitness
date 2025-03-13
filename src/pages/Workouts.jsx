import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Dumbbell, Calendar, Clock, Plus, X, Check, ChevronDown, 
  ChevronUp, Edit, Trash2, AlertCircle, Save 
} from 'lucide-react';
import * as workoutService from '../services/workoutService';

const Workouts = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('scheduled');
  const [expandedTemplate, setExpandedTemplate] = useState(null);
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [workoutInProgress, setWorkoutInProgress] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [workoutTemplates, setWorkoutTemplates] = useState([]);
  const [scheduledWorkouts, setScheduledWorkouts] = useState([]);
  const [completedWorkouts, setCompletedWorkouts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchWorkouts();
  }, []);
  
  // Fetch all workouts and separate into templates, scheduled, and completed
  const fetchWorkouts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const workouts = await workoutService.getWorkouts();
      
      // Templates don't have dates
      const templates = workouts.filter(w => !w.date);
      
      // Scheduled workouts have dates and are not completed
      const scheduled = workouts.filter(w => 
        w.date && (w.status === 'planned' || w.status === 'in_progress')
      );
      
      // Completed workouts have dates and are completed
      const completed = workouts.filter(w => 
        w.date && (w.status === 'completed' || w.status === 'skipped')
      );
      
      setWorkoutTemplates(templates);
      setScheduledWorkouts(scheduled);
      setCompletedWorkouts(completed);
      setIsLoading(false);
    } catch (err) {
      console.error('Error fetching workouts:', err);
      setError('Failed to load workouts. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Toggle template expansion
  const toggleTemplateExpansion = (templateId) => {
    if (expandedTemplate === templateId) {
      setExpandedTemplate(null);
    } else {
      setExpandedTemplate(templateId);
    }
  };
  
  // Start a workout from a template or scheduled workout
  const startWorkout = async (workoutId, isTemplate = false) => {
    setIsLoading(true);
    setError('');
    try {
      let workout;
      
      if (isTemplate) {
        // If starting from template, create a new workout instance
        const today = new Date().toISOString().split('T')[0];
        workout = await workoutService.createWorkoutFromTemplate(workoutId, today);
      } else {
        // If it's already a scheduled workout, just get it and update status
        workout = await workoutService.getWorkoutById(workoutId);
      }
      
      // Prepare the workout for tracking
      const workoutForTracking = {
        ...workout,
        startTime: new Date().toISOString(),
        status: 'in_progress',
        exercises: workout.exercises.map(ex => ({
          ...ex,
          sets: ex.sets.map(set => ({ 
            weight: set.weight || '',
            reps: set.reps || '',
            completed: false
          }))
        }))
      };
      
      // Update the workout status in the database
      await workoutService.updateWorkout(workout._id, {
        status: 'in_progress',
        startTime: workoutForTracking.startTime
      });
      
      setActiveWorkout(workoutForTracking);
      setWorkoutInProgress(true);
      setIsLoading(false);
    } catch (err) {
      console.error('Error starting workout:', err);
      setError('Failed to start workout. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Update exercise set data during active workout
  const updateSetData = (exerciseIndex, setIndex, field, value) => {
    const updatedWorkout = { ...activeWorkout };
    updatedWorkout.exercises[exerciseIndex].sets[setIndex][field] = value;
    setActiveWorkout(updatedWorkout);
  };
  
  // Toggle set completion during active workout
  const toggleSetCompletion = (exerciseIndex, setIndex) => {
    const updatedWorkout = { ...activeWorkout };
    const currentStatus = updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed;
    updatedWorkout.exercises[exerciseIndex].sets[setIndex].completed = !currentStatus;
    setActiveWorkout(updatedWorkout);
  };
  
  // End and save the current workout
  const completeWorkout = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Calculate totals and prep data for saving
      let totalWeight = 0;
      let totalReps = 0;
      let totalSets = 0;
      
      activeWorkout.exercises.forEach(exercise => {
        exercise.sets.forEach(set => {
          if (set.completed) {
            const weight = parseFloat(set.weight) || 0;
            const reps = parseInt(set.reps) || 0;
            totalWeight += (weight * reps);
            totalReps += reps;
            totalSets += 1;
          }
        });
      });
      
      const workoutData = {
        ...activeWorkout,
        endTime: new Date().toISOString(),
        duration: calculateDuration(activeWorkout.startTime, new Date().toISOString()),
        status: 'completed',
        totalWeight,
        totalReps,
        totalSets
      };
      
      await workoutService.updateWorkout(activeWorkout._id, workoutData);
      
      setWorkoutInProgress(false);
      setActiveWorkout(null);
      
      // Refresh the workout lists
      await fetchWorkouts();
      
      // Show success
      alert('Workout completed and saved!');
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error completing workout:', err);
      setError('Failed to save workout. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Calculate duration between two timestamps in minutes
  const calculateDuration = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    return Math.round((end - start) / (1000 * 60));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Estimate workout duration based on exercise count
  const estimateDuration = (exercises) => {
    if (!exercises || !exercises.length) return 0;
    
    let totalTime = 0;
    exercises.forEach(exercise => {
      const sets = exercise.sets ? exercise.sets.length : 0;
      // Estimate: 1 minute per set + rest time between sets
      const restTimeMin = parseRestTimeToMinutes(exercise.rest);
      totalTime += sets * (1 + restTimeMin);
    });
    
    return Math.max(10, totalTime); // Minimum 10 minutes
  };
  
  // Convert rest time string to minutes
  const parseRestTimeToMinutes = (restTime) => {
    if (!restTime) return 1; // Default 1 minute
    
    const minutes = restTime.match(/(\d+)\s*min/i);
    const seconds = restTime.match(/(\d+)\s*sec/i);
    
    let totalMinutes = 0;
    if (minutes) totalMinutes += parseInt(minutes[1]);
    if (seconds) totalMinutes += parseInt(seconds[1]) / 60;
    
    return totalMinutes || 1; // Default to 1 minute if parsing fails
  };
  
  // Start editing a template
  const startEditingTemplate = (template) => {
    setEditingTemplate({
      ...template,
      exercises: template.exercises.map(ex => ({
        ...ex,
        sets: ex.sets.map(set => ({ ...set }))
      }))
    });
    setIsEditing(true);
  };
  const updateTemplateField = (field, value) => {
    setEditingTemplate({
      ...editingTemplate,
      [field]: value
    });
  };
  
  // Update exercise in template
  const updateExerciseField = (exerciseIndex, field, value) => {
    const updatedTemplate = { ...editingTemplate };
    updatedTemplate.exercises[exerciseIndex][field] = value;
    setEditingTemplate(updatedTemplate);
  };
  
  // Add new exercise to template
  const addExerciseToTemplate = () => {
    const updatedTemplate = { ...editingTemplate };
    const newExercise = {
      name: '',
      sets: Array(3).fill().map(() => ({ weight: '', reps: '', completed: false })),
      rest: '60 sec',
      notes: ''
    };
    updatedTemplate.exercises = [...updatedTemplate.exercises, newExercise];
    setEditingTemplate(updatedTemplate);
  };
  
  // Remove exercise from template
  const removeExerciseFromTemplate = (exerciseIndex) => {
    const updatedTemplate = { ...editingTemplate };
    updatedTemplate.exercises = updatedTemplate.exercises.filter((_, index) => index !== exerciseIndex);
    setEditingTemplate(updatedTemplate);
  };
  
  // Save edited template
  const saveTemplate = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Validate template data
      if (!editingTemplate.name || !editingTemplate.exercises.length) {
        setError('Please provide a name and at least one exercise');
        setIsLoading(false);
        return;
      }
      
      // Make sure all exercises have names
      const hasEmptyExercise = editingTemplate.exercises.some(ex => !ex.name);
      if (hasEmptyExercise) {
        setError('All exercises must have names');
        setIsLoading(false);
        return;
      }
      
      if (editingTemplate._id) {
        // Update existing template
        await workoutService.updateWorkout(editingTemplate._id, editingTemplate);
      } else {
        // Create new template
        await workoutService.createWorkout(editingTemplate);
      }
      
      // Refresh templates
      await fetchWorkouts();
      
      // Reset editing state
      setIsEditing(false);
      setEditingTemplate(null);
      setIsLoading(false);
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Create new template
  const createNewTemplate = () => {
    setEditingTemplate({
      name: 'New Workout Template',
      type: 'Strength',
      difficulty: 'Intermediate',
      exercises: [
        {
          name: '',
          sets: Array(3).fill().map(() => ({ weight: '', reps: '', completed: false })),
          rest: '60 sec',
          notes: ''
        }
      ],
      status: 'planned'
    });
    setIsEditing(true);
  };
  
  // Delete a template
  const deleteTemplate = async (templateId) => {
    if (!window.confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      await workoutService.deleteWorkout(templateId);
      
      // Refresh templates
      await fetchWorkouts();
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error deleting template:', err);
      setError('Failed to delete template. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Add set to exercise in template
  const addSetToExercise = (exerciseIndex) => {
    const updatedTemplate = { ...editingTemplate };
    const exercise = updatedTemplate.exercises[exerciseIndex];
    exercise.sets = [...exercise.sets, { weight: '', reps: '', completed: false }];
    setEditingTemplate(updatedTemplate);
  };
  
  // Remove set from exercise in template
  const removeSetFromExercise = (exerciseIndex, setIndex) => {
    const updatedTemplate = { ...editingTemplate };
    const exercise = updatedTemplate.exercises[exerciseIndex];
    exercise.sets = exercise.sets.filter((_, index) => index !== setIndex);
    setEditingTemplate(updatedTemplate);
  };
  
  // Schedule a workout from a template
  const scheduleWorkout = async (templateId) => {
    try {
      // Get the selected date from user
      const dateStr = prompt('Enter date for this workout (YYYY-MM-DD):');
      if (!dateStr) return;
      
      setIsLoading(true);
      
      // Create workout from template for the selected date
      await workoutService.createWorkoutFromTemplate(templateId, dateStr);
      
      // Refresh workouts
      await fetchWorkouts();
      
      setIsLoading(false);
      
      // Switch to scheduled tab
      setActiveTab('scheduled');
    } catch (err) {
      console.error('Error scheduling workout:', err);
      setError('Failed to schedule workout. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Cancel current workout
  const cancelWorkout = async () => {
    if (!window.confirm('Are you sure you want to cancel this workout? All progress will be lost.')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Update workout status to planned
      await workoutService.updateWorkout(activeWorkout._id, {
        status: 'planned',
        startTime: null
      });
      
      // Reset state
      setWorkoutInProgress(false);
      setActiveWorkout(null);
      
      // Refresh workouts
      await fetchWorkouts();
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error canceling workout:', err);
      setError('Failed to cancel workout. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Skip a scheduled workout
  const skipWorkout = async (workoutId) => {
    if (!window.confirm('Mark this workout as skipped?')) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Update workout status to skipped
      await workoutService.updateWorkout(workoutId, {
        status: 'skipped'
      });
      
      // Refresh workouts
      await fetchWorkouts();
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error skipping workout:', err);
      setError('Failed to skip workout. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Loading indicator
  if (isLoading && !workoutInProgress) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900">Workouts</h1>
      <p className="mt-1 text-sm text-gray-500">
        Track and manage your workout routines
      </p>
      
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {isEditing ? (
        // Template Editor
        <div className="mt-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">
                  {editingTemplate._id ? 'Edit Template' : 'Create Template'}
                </h2>
                <p className="text-sm text-gray-500">Design your workout template</p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={saveTemplate}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingTemplate(null);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6 mb-6">
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Template Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={editingTemplate.name}
                    onChange={(e) => updateTemplateField('name', e.target.value)}
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                
                <div className="sm:col-span-3">
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                    Workout Type
                  </label>
                  <select
                    id="type"
                    name="type"
                    value={editingTemplate.type}
                    onChange={(e) => updateTemplateField('type', e.target.value)}
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="Strength">Strength</option>
                    <option value="Hypertrophy">Hypertrophy</option>
                    <option value="Endurance">Endurance</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Recovery">Recovery</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700">
                    Difficulty
                  </label>
                  <select
                    id="difficulty"
                    name="difficulty"
                    value={editingTemplate.difficulty}
                    onChange={(e) => updateTemplateField('difficulty', e.target.value)}
                    className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Exercises</h3>
                
                {editingTemplate.exercises.map((exercise, exerciseIndex) => (
                  <div 
                    key={exerciseIndex}
                    className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <div className="sm:col-span-4 flex-grow mr-4">
                        <label htmlFor={`exercise-${exerciseIndex}-name`} className="block text-sm font-medium text-gray-700">
                          Exercise Name
                        </label>
                        <input
                          type="text"
                          id={`exercise-${exerciseIndex}-name`}
                          value={exercise.name}
                          onChange={(e) => updateExerciseField(exerciseIndex, 'name', e.target.value)}
                          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                          placeholder="e.g., Bench Press"
                        />
                      </div>
                      
                      <div className="sm:col-span-2 w-32">
                        <label htmlFor={`exercise-${exerciseIndex}-rest`} className="block text-sm font-medium text-gray-700">
                          Rest Time
                        </label>
                        <select
                          id={`exercise-${exerciseIndex}-rest`}
                          value={exercise.rest}
                          onChange={(e) => updateExerciseField(exerciseIndex, 'rest', e.target.value)}
                          className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="30 sec">30 sec</option>
                          <option value="45 sec">45 sec</option>
                          <option value="60 sec">60 sec</option>
                          <option value="90 sec">90 sec</option>
                          <option value="2 min">2 min</option>
                          <option value="3 min">3 min</option>
                          <option value="5 min">5 min</option>
                        </select>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => removeExerciseFromTemplate(exerciseIndex)}
                        className="mt-4 inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="mr-1 h-3 w-3" />
                        Remove
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Sets</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Set
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Target Weight
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Target Reps
                              </th>
                              <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {exercise.sets.map((set, setIndex) => (
                              <tr key={`set-${setIndex}`}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {setIndex + 1}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <input
                                    type="text"
                                    value={set.weight}
                                    onChange={(e) => {
                                      const updatedTemplate = { ...editingTemplate };
                                      updatedTemplate.exercises[exerciseIndex].sets[setIndex].weight = e.target.value;
                                      setEditingTemplate(updatedTemplate);
                                    }}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md w-24"
                                    placeholder="e.g., 135"
                                  />
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                  <input
                                    type="text"
                                    value={set.reps}
                                    onChange={(e) => {
                                      const updatedTemplate = { ...editingTemplate };
                                      updatedTemplate.exercises[exerciseIndex].sets[setIndex].reps = e.target.value;
                                      setEditingTemplate(updatedTemplate);
                                    }}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md w-24"
                                    placeholder="e.g., 8-10"
                                  />
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-center">
                                  <button
                                    onClick={() => removeSetFromExercise(exerciseIndex, setIndex)}
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => addSetToExercise(exerciseIndex)}
                        className="mt-3 inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Plus className="mr-1 h-3 w-3" />
                        Add Set
                      </button>
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor={`exercise-${exerciseIndex}-notes`} className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        id={`exercise-${exerciseIndex}-notes`}
                        value={exercise.notes || ''}
                        onChange={(e) => updateExerciseField(exerciseIndex, 'notes', e.target.value)}
                        rows={2}
                        className="mt-1 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="Exercise notes, cues, or tips..."
                      ></textarea>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addExerciseToTemplate}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Exercise
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : workoutInProgress ? (
        // Active Workout Interface
        <div className="mt-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium text-gray-900">{activeWorkout.name}</h2>
                <p className="text-sm text-gray-500">Workout in progress</p>
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={completeWorkout}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <Check className="mr-2 h-4 w-4" />
                  Complete Workout
                </button>
                <button
                  type="button"
                  onClick={cancelWorkout}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              {activeWorkout.exercises.map((exercise, exerciseIndex) => (
                <div 
                  key={`${exercise.name}-${exerciseIndex}`}
                  className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
                >
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-md font-medium text-gray-900">{exercise.name}</h3>
                    <span className="text-sm text-gray-500">
                      {exercise.sets.length} sets {exercise.rest && `• Rest: ${exercise.rest}`}
                    </span>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Set
                          </th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Weight (lbs)
                          </th>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reps
                          </th>
                          <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Done
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {exercise.sets.map((set, setIndex) => (
                          <tr key={`set-${setIndex}`}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                              {setIndex + 1}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                value={set.weight}
                                onChange={(e) => updateSetData(exerciseIndex, setIndex, 'weight', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md w-20"
                                placeholder="lbs"
                              />
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                              <input
                                type="number"
                                value={set.reps}
                                onChange={(e) => updateSetData(exerciseIndex, setIndex, 'reps', e.target.value)}
                                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md w-20"
                                placeholder="reps"
                              />
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap text-center">
                              <button
                                onClick={() => toggleSetCompletion(exerciseIndex, setIndex)}
                                className={`h-6 w-6 rounded-full focus:outline-none ${
                                  set.completed
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-400'
                                }`}
                              >
                                {set.completed && <Check className="h-4 w-4 mx-auto" />}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  {exercise.notes && (
                    <div className="mt-3 text-sm text-gray-500">
                      <p><span className="font-medium">Notes:</span> {exercise.notes}</p>
                    </div>
                  )}
                </div>
              ))}
              
              <div className="mt-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Workout Notes
                </label>
                <div className="mt-1">
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Add notes about this workout session..."
                    value={activeWorkout.notes || ''}
                    onChange={(e) => setActiveWorkout({...activeWorkout, notes: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Workouts Management Interface (Tabs)
        <div className="mt-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('scheduled')}
                className={`${
                  activeTab === 'scheduled'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Scheduled
              </button>
              <button
                onClick={() => setActiveTab('templates')}
                className={`${
                  activeTab === 'templates'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Templates
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`${
                  activeTab === 'history'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                History
              </button>
            </nav>
          </div>
          
          {/* Tab content */}
          <div className="py-6">
            {/* Scheduled Workouts Tab */}
            {activeTab === 'scheduled' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Scheduled Workouts</h2>
                </div>
                
                {scheduledWorkouts.length === 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500">
                    <p>No scheduled workouts. Select a template to schedule a workout.</p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('templates')}
                      className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-indigo-600 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Templates
                    </button>
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {scheduledWorkouts.map((workout) => (
                        <li key={workout._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Dumbbell className="h-5 w-5 text-indigo-600 mr-3" />
                                <p className="text-md font-medium text-indigo-600 truncate">{workout.name}</p>
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => startWorkout(workout._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Start
                                </button>
                                <button
                                  onClick={() => skipWorkout(workout._id)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Skip
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  {workout.type}
                                  {workout.difficulty && (
                                    <>
                                      <span className="mx-1">•</span>
                                      {workout.difficulty}
                                    </>
                                  )}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p>{formatDate(workout.date)}</p>
                                {workout.exercises && (
                                  <>
                                    <Clock className="flex-shrink-0 ml-4 mr-1.5 h-4 w-4 text-gray-400" />
                                    <p>~{estimateDuration(workout.exercises)} min</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Templates Tab */}
            {activeTab === 'templates' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Workout Templates</h2>
                  <button
                    type="button"
                    onClick={createNewTemplate}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Template
                  </button>
                </div>
                
                {workoutTemplates.length === 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500">
                    <p>No workout templates. Create a template to get started.</p>
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {workoutTemplates.map((template) => (
                        <li key={template._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <button
                                onClick={() => toggleTemplateExpansion(template._id)}
                                className="flex items-center focus:outline-none text-left"
                              >
                                <Dumbbell className="h-5 w-5 text-indigo-600 mr-3" />
                                <p className="text-md font-medium text-indigo-600 truncate">{template.name}</p>
                                {expandedTemplate === template._id ? (
                                  <ChevronUp className="ml-2 h-4 w-4 text-gray-500" />
                                ) : (
                                  <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
                                )}
                              </button>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => scheduleWorkout(template._id)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  Schedule
                                </button>
                                <button
                                  onClick={() => startWorkout(template._id, true)}
                                  className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                >
                                  Start Now
                                </button>
                                <button
                                  onClick={() => startEditingTemplate(template)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                  <Edit className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => deleteTemplate(template._id)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded shadow-sm text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  {template.type}
                                  {template.difficulty && (
                                    <>
                                      <span className="mx-1">•</span>
                                      {template.difficulty}
                                    </>
                                  )}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                {template.exercises && (
                                  <>
                                    <p>{template.exercises.length} exercises</p>
                                    <Clock className="flex-shrink-0 ml-4 mr-1.5 h-4 w-4 text-gray-400" />
                                    <p>~{estimateDuration(template.exercises)} min</p>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {/* Expanded template details */}
                            {expandedTemplate === template._id && template.exercises && (
                              <div className="mt-4 border-t border-gray-200 pt-4">
                                <h4 className="text-sm font-medium text-gray-900 mb-2">Exercises</h4>
                                <ul className="divide-y divide-gray-200">
                                  {template.exercises.map((exercise, i) => (
                                    <li key={`${exercise.name}-${i}`} className="py-2">
                                      <div className="flex justify-between">
                                        <p className="text-sm font-medium text-gray-900">{exercise.name}</p>
                                        <p className="text-sm text-gray-500">
                                          {exercise.sets && exercise.sets.length} sets • Rest: {exercise.rest || 'None'}
                                        </p>
                                      </div>
                                      {exercise.sets && (
                                        <div className="mt-1">
                                          <p className="text-xs text-gray-500">
                                            Sets: {exercise.sets.map((set, idx) => (
                                              <span key={idx} className="inline-block mr-2">
                                                {set.weight && set.reps
                                                  ? `${set.weight} x ${set.reps}`
                                                  : 'Not specified'}
                                              </span>
                                            ))}
                                          </p>
                                        </div>
                                      )}
                                      {exercise.notes && (
                                        <p className="mt-1 text-xs text-gray-500">Notes: {exercise.notes}</p>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* History Tab */}
            {activeTab === 'history' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium text-gray-900">Workout History</h2>
                </div>
                
                {completedWorkouts.length === 0 ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md p-6 text-center text-gray-500">
                    <p>No workout history yet. Complete workouts to see them here.</p>
                  </div>
                ) : (
                  <div className="bg-white shadow overflow-hidden sm:rounded-md">
                    <ul className="divide-y divide-gray-200">
                      {completedWorkouts.map((workout) => (
                        <li key={workout._id}>
                          <div className="px-4 py-4 sm:px-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <Dumbbell className="h-5 w-5 text-indigo-600 mr-3" />
                                <p className="text-md font-medium text-indigo-600 truncate">{workout.name}</p>
                                {workout.status === 'skipped' && (
                                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    Skipped
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="mt-2 sm:flex sm:justify-between">
                              <div className="sm:flex">
                                <p className="flex items-center text-sm text-gray-500">
                                  {workout.type}
                                  {workout.difficulty && (
                                    <>
                                      <span className="mx-1">•</span>
                                      {workout.difficulty}
                                    </>
                                  )}
                                </p>
                              </div>
                              <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                                <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                <p>{formatDate(workout.date)}</p>
                                {workout.duration && (
                                  <>
                                    <Clock className="flex-shrink-0 ml-4 mr-1.5 h-4 w-4 text-gray-400" />
                                    <p>{workout.duration} min</p>
                                  </>
                                )}
                              </div>
                            </div>
                            
                            {workout.status === 'completed' && (
                              <div className="mt-2 grid grid-cols-3 gap-4 text-center">
                                <div className="bg-gray-50 rounded-md p-2">
                                  <p className="text-xs text-gray-500">Sets</p>
                                  <p className="text-md font-medium">{workout.totalSets || 0}</p>
                                </div>
                                <div className="bg-gray-50 rounded-md p-2">
                                  <p className="text-xs text-gray-500">Reps</p>
                                  <p className="text-md font-medium">{workout.totalReps || 0}</p>
                                </div>
                                <div className="bg-gray-50 rounded-md p-2">
                                  <p className="text-xs text-gray-500">Volume</p>
                                  <p className="text-md font-medium">{workout.totalWeight ? `${workout.totalWeight} lbs` : '0'}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workouts;