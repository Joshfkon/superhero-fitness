import api from './api';

// Register user with enhanced error logging
export const register = async (userData) => {
  console.log('AuthService: Attempting to register user', {
    ...userData,
    password: '***REDACTED***'
  });
  
  try {
    console.log('AuthService: Sending registration request to API');
    const response = await api.post('/users/register', userData);
    console.log('AuthService: Registration API response received', response.status);
    
    if (response.data.token) {
      console.log('AuthService: Setting auth token and user data in localStorage');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    } else {
      console.warn('AuthService: No token received in response');
    }
    
    return response.data;
  } catch (error) {
    console.error('AuthService: Registration error:', error);
    if (error.response) {
      console.error('AuthService: Error response from server:', {
        status: error.response.status,
        data: error.response.data
      });
      throw error.response.data || new Error(`Registration failed with status ${error.response.status}`);
    } else if (error.request) {
      console.error('AuthService: No response received from server', error.request);
      throw new Error('Registration failed: No response from server');
    }
    throw error;
  }
};

// Login user
export const login = async (credentials) => {
  try {
    console.log('AuthService: Attempting to login user');
    const response = await api.post('/users/login', credentials);
    console.log('AuthService: Login response received');
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    console.error('AuthService: Login error:', error);
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/users/profile');
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to get user profile');
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/users/profile', userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Failed to update user profile');
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

// Get current user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};