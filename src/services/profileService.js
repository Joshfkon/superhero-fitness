import api from './api';

// Get user's fitness profile
export const getProfile = async () => {
  try {
    const response = await api.get('/profiles/me');  // Changed from '/profiles'
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get profile');
  }
};

// Create or update user's fitness profile
export const createOrUpdateProfile = async (profileData) => {
  try {
    const response = await api.post('/profiles/me', profileData);  // Changed from '/profiles'
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update profile');
  }
};

// Calculate target measurements based on wrist size
export const calculateIdealMeasurements = (wristSize) => {
  if (!wristSize) return null;
  
  return {
    chest: parseFloat((wristSize * 6.5).toFixed(1)),
    shoulders: parseFloat((wristSize * 7.5).toFixed(1)),
    biceps: parseFloat((wristSize * 2.3).toFixed(1)),
    forearms: parseFloat((wristSize * 1.8).toFixed(1)),
    neck: parseFloat((wristSize * 2.3).toFixed(1)),
    waist: parseFloat((wristSize * 4.5).toFixed(1)),
    thighs: parseFloat((wristSize * 3.5).toFixed(1)),
    calves: parseFloat((wristSize * 2.3).toFixed(1)),
  };
};