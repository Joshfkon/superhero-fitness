import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../services';

const PrivateRoute = () => {
  // Check if user is authenticated
  const isAuthenticated = authService.isAuthenticated();
  
  // If authenticated, render the child routes
  // If not, redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;