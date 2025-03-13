import React from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dumbbell, Apple, Activity, TrendingUp, Scale, Award } from 'lucide-react';

// Sample data for charts
const weightData = [
  { name: 'Jan', weight: 185 },
  { name: 'Feb', weight: 183 },
  { name: 'Mar', weight: 181 },
  { name: 'Apr', weight: 180 },
  { name: 'May', weight: 178 },
  { name: 'Jun', weight: 176 },
];

const workoutData = [
  { name: 'Mon', chest: 4, back: 0, legs: 0, shoulders: 0, arms: 2 },
  { name: 'Tue', chest: 0, back: 4, legs: 0, shoulders: 0, arms: 2 },
  { name: 'Wed', chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0 },
  { name: 'Thu', chest: 0, back: 0, legs: 4, shoulders: 0, arms: 0 },
  { name: 'Fri', chest: 0, back: 0, legs: 0, shoulders: 3, arms: 3 },
  { name: 'Sat', chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0 },
  { name: 'Sun', chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0 },
];

const nutritionData = [
  { name: 'Mon', protein: 150, carbs: 200, fat: 70 },
  { name: 'Tue', protein: 160, carbs: 180, fat: 65 },
  { name: 'Wed', protein: 140, carbs: 190, fat: 60 },
  { name: 'Thu', protein: 170, carbs: 170, fat: 75 },
  { name: 'Fri', protein: 155, carbs: 185, fat: 70 },
  { name: 'Sat', protein: 130, carbs: 210, fat: 80 },
  { name: 'Sun', protein: 145, carbs: 195, fat: 65 },
];

// Stat Card Component
const StatCard = ({ title, value, icon: Icon, change, trend }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
            <Icon className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          <span className={`font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </span>{' '}
          <span className="text-gray-500">from last week</span>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of your fitness journey and progress towards your superhero physique
      </p>

      {/* Stats Overview */}
      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          title="Current Weight" 
          value="176 lbs" 
          icon={Scale} 
          change="2 lbs" 
          trend="down" 
        />
        <StatCard 
          title="Workout Completion" 
          value="92%" 
          icon={Dumbbell} 
          change="5%" 
          trend="up" 
        />
        <StatCard 
          title="Protein Goal" 
          value="85%" 
          icon={Apple} 
          change="3%" 
          trend="up" 
        />
        <StatCard 
          title="Recovery Score" 
          value="87/100" 
          icon={Activity} 
          change="2 pts" 
          trend="up" 
        />
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Weight Trend Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Scale className="mr-2 h-5 w-5 text-indigo-500" />
              Weight Trend
            </h3>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weightData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={['dataMin - 5', 'dataMax + 5']} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#4f46e5" 
                    strokeWidth={2}
                    dot={{ r: 4 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Weekly Workouts Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Dumbbell className="mr-2 h-5 w-5 text-indigo-500" />
              Weekly Workouts
            </h3>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={workoutData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="chest" stackId="a" fill="#4f46e5" />
                  <Bar dataKey="back" stackId="a" fill="#7c3aed" />
                  <Bar dataKey="legs" stackId="a" fill="#ec4899" />
                  <Bar dataKey="shoulders" stackId="a" fill="#8b5cf6" />
                  <Bar dataKey="arms" stackId="a" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Progress towards goal & Nutrition trend */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Progress Towards Goal */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Award className="mr-2 h-5 w-5 text-indigo-500" />
              Progress Towards Superhero Physique
            </h3>
            <div className="mt-4 space-y-4">
              {/* Chest Measurement */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">Chest (44" / 48")</div>
                  <div className="text-sm text-gray-500">92%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              {/* Arms Measurement */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">Arms (15" / 17")</div>
                  <div className="text-sm text-gray-500">88%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>
              
              {/* Shoulders Measurement */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">Shoulders (48" / 52")</div>
                  <div className="text-sm text-gray-500">92%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              
              {/* Waist Measurement */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">Waist (32" / 30")</div>
                  <div className="text-sm text-gray-500">94%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
              
              {/* Body Fat Percentage */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="text-sm font-medium text-gray-700">Body Fat (14% / 10%)</div>
                  <div className="text-sm text-gray-500">71%</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '71%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Nutrition Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Apple className="mr-2 h-5 w-5 text-indigo-500" />
              Weekly Nutrition
            </h3>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={nutritionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="protein" fill="#4f46e5" />
                  <Bar dataKey="carbs" fill="#10b981" />
                  <Bar dataKey="fat" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;