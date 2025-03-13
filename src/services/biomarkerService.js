import api from './api';

// Get all biomarker entries
export const getBiomarkers = async () => {
  try {
    const response = await api.get('/biomarkers');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get biomarkers');
  }
};

// Get latest biomarker entry
export const getLatestBiomarker = async () => {
  try {
    const response = await api.get('/biomarkers/latest');
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // No entries yet
    }
    throw error.response ? error.response.data : new Error('Failed to get latest biomarker');
  }
};

// Get biomarker by date
export const getBiomarkerByDate = async (date) => {
  try {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    const response = await api.get(`/biomarkers/date/${formattedDate}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return null; // No entry for this date
    }
    throw error.response ? error.response.data : new Error('Failed to get biomarker data');
  }
};

// Get biomarkers by type
export const getBiomarkersByType = async (type) => {
  try {
    const response = await api.get(`/biomarkers/type/${type}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error(`Failed to get ${type} biomarkers`);
  }
};

// Create or update biomarker
export const createOrUpdateBiomarker = async (biomarkerData) => {
  try {
    const response = await api.post('/biomarkers', biomarkerData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to save biomarker data');
  }
};

// Update biomarker
export const updateBiomarker = async (id, biomarkerData) => {
  try {
    const response = await api.put(`/biomarkers/${id}`, biomarkerData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update biomarker');
  }
};

// Delete biomarker
export const deleteBiomarker = async (id) => {
  try {
    const response = await api.delete(`/biomarkers/${id}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to delete biomarker');
  }
};

// Calculate recovery score
export const calculateRecoveryScore = (sleepQuality, muscleReadiness, energyLevel) => {
  if (!sleepQuality || !muscleReadiness || !energyLevel) return null;
  
  // Simple weighted average formula
  const muscleWeight = 0.35;
  const energyWeight = 0.3;
  const sleepWeight = 0.35;
  
  return Math.round(
    (sleepQuality * sleepWeight * 10) +
    (muscleReadiness * muscleWeight * 10) +
    (energyLevel * energyWeight * 10)
  );
};