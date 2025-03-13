// workoutService.js
import api from './api';

// Get all workouts
export const getWorkouts = async () => {
  try {
    const response = await api.get('/workouts');
    return response.data;
  } catch (error) {
    console.error('Error fetching workouts:', error);
    throw error.response ? error.response.data : new Error('Failed to fetch workouts');
  }
};

// Get a single workout by ID
export const getWorkoutById = async (workoutId) => {
  try {
    const response = await api.get(`/workouts/${workoutId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching workout with ID ${workoutId}:`, error);
    throw error.response ? error.response.data : new Error('Failed to fetch workout');
  }
};

// Create a new workout
export const createWorkout = async (workoutData) => {
  try {
    const response = await api.post('/workouts', workoutData);
    return response.data;
  } catch (error) {
    console.error('Error creating workout:', error);
    throw error.response ? error.response.data : new Error('Failed to create workout');
  }
};

// Update an existing workout
export const updateWorkout = async (workoutId, workoutData) => {
  try {
    const response = await api.put(`/workouts/${workoutId}`, workoutData);
    return response.data;
  } catch (error) {
    console.error(`Error updating workout with ID ${workoutId}:`, error);
    throw error.response ? error.response.data : new Error('Failed to update workout');
  }
};

// Delete a workout
export const deleteWorkout = async (workoutId) => {
  try {
    const response = await api.delete(`/workouts/${workoutId}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting workout with ID ${workoutId}:`, error);
    throw error.response ? error.response.data : new Error('Failed to delete workout');
  }
};

// Create a workout from a template for a specific date
export const createWorkoutFromTemplate = async (templateId, date) => {
  try {
    const response = await api.post(`/workouts/template/${templateId}/schedule`, { date });
    return response.data;
  } catch (error) {
    console.error('Error creating workout from template:', error);
    throw error.response ? error.response.data : new Error('Failed to create workout from template');
  }
};