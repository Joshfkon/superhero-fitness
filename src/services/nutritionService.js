import api from './api';

// Get all nutrition entries
export const getNutritionEntries = async () => {
  try {
    const response = await api.get('/nutrition');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get nutrition entries');
  }
};

// Get nutrition entry by date
export const getNutritionByDate = async (date) => {
  try {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const response = await api.get(`/nutrition/date/${formattedDate}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // No entry for this date
    }
    throw error.response ? error.response.data : new Error('Failed to get nutrition data');
  }
};

// Create or update nutrition entry
export const createOrUpdateNutrition = async (nutritionData) => {
  try {
    const response = await api.post('/nutrition', nutritionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to save nutrition data');
  }
};

// Add meal to nutrition entry
export const addMeal = async (nutritionId, mealData) => {
  try {
    const response = await api.post(`/nutrition/${nutritionId}/meal`, mealData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to add meal');
  }
};

// Update nutrition entry
export const updateNutrition = async (id, nutritionData) => {
  try {
    const response = await api.put(`/nutrition/${id}`, nutritionData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update nutrition data');
  }
};

// Delete nutrition entry
export const deleteNutrition = async (id) => {
  try {
    const response = await api.delete(`/nutrition/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete nutrition entry');
  }
};

// Calculate macronutrient ratios
export const calculateMacroRatios = (protein, carbs, fat) => {
  const totalCaloriesFromMacros = (protein * 4) + (carbs * 4) + (fat * 9);
  
  if (totalCaloriesFromMacros === 0) return { protein: 0, carbs: 0, fat: 0 };
  
  return {
    protein: Math.round((protein * 4 / totalCaloriesFromMacros) * 100),
    carbs: Math.round((carbs * 4 / totalCaloriesFromMacros) * 100),
    fat: Math.round((fat * 9 / totalCaloriesFromMacros) * 100)
  };
};