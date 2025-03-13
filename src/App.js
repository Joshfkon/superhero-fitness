import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Layout components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PrivateRoute from './components/PrivateRoute';

// Pages
import Dashboard from './pages/Dashboard';
import DataImport from './pages/DataImport';
import ProfileSetup from './pages/ProfileSetup';
import Workouts from './pages/Workouts';
import Nutrition from './pages/Nutrition';
import Biomarkers from './pages/Biomarkers';
import Measurements from './pages/measurements';
import Login from './pages/Login';
import Register from './pages/Register';

// Services
import { authService } from './services';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  
  // Check if user is logged in
  useEffect(() => {
    const loggedInUser = authService.getCurrentUser();
    if (loggedInUser) {
      setUser(loggedInUser);
    }
  }, []);
  
  // Layout for private routes (with navbar and sidebar)
  const PrivateLayout = () => (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar setSidebarOpen={setSidebarOpen} user={user} />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<PrivateLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/import" element={<DataImport />} />
            <Route path="/profile" element={<ProfileSetup />} />
            <Route path="/workouts" element={<Workouts />} />
            <Route path="/measurements" element={<Measurements />} />
            <Route path="/nutrition" element={<Nutrition />} />
            <Route path="/biomarkers" element={<Biomarkers />} />
          </Route>
        </Route>

        {/* Redirect to dashboard if path doesn't match */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;