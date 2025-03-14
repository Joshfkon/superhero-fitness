import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  X, 
  LayoutDashboard, 
  Upload, 
  UserCircle, 
  Dumbbell, 
  Apple, 
  Activity, 
  Settings,
  Brain,
  Ruler 
} from 'lucide-react';

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'AI Training Plan', href: '/ai-training-plan', icon: Brain },
    { name: 'Workouts', href: '/workouts', icon: Dumbbell },
    { name: 'Update Measurements', href: '/measurements', icon: Ruler },
    { name: 'Nutrition', href: '/nutrition', icon: Apple },
    { name: 'Biomarkers', href: '/biomarkers', icon: Activity },
    { name: 'Data Import', href: '/import', icon: Upload },
    { name: 'Settings', href: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 flex flex-col w-64 bg-indigo-700 text-white transform transition-transform duration-300 ease-in-out z-50 ${
        open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      } md:static md:z-auto`}>
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 bg-indigo-800">
          <div className="text-xl font-bold">SuperHero Fitness</div>
          <button className="md:hidden" onClick={() => setOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                  isActive
                    ? 'bg-indigo-800 text-white'
                    : 'text-white hover:bg-indigo-600'
                }`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* User profile section */}
        <div className="p-4 border-t border-indigo-800">
          <Link to="/profile" className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white">
                <UserCircle size={20} />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-white">User Profile</p>
              <p className="text-xs text-indigo-300">View profile</p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;