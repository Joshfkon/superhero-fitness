import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell, Settings, User, LogOut } from 'lucide-react';
import { authService } from '../../services';

const Navbar = ({ setSidebarOpen, user }) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  // Handle logout
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              className="text-gray-500 focus:outline-none focus:text-gray-700 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <div className="ml-4 md:ml-0">
              <h1 className="text-xl font-bold text-indigo-600">SuperHero Fitness</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
              <Bell size={20} />
            </button>
            <button className="p-1 text-gray-400 hover:text-gray-500 focus:outline-none">
              <Settings size={20} />
            </button>
            <div className="relative">
              <button 
                className="flex items-center focus:outline-none"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700">
                  <User size={18} />
                </div>
              </button>
              
              {/* User dropdown menu */}
              {userMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    <div className="font-medium">{user?.name || 'User'}</div>
                    <div className="text-gray-500">{user?.email || ''}</div>
                  </div>
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Your Profile
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <LogOut size={16} className="mr-2" />
                      Sign out
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;