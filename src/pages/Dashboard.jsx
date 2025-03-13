import React from 'react';
import { BarChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Dumbbell, Apple, Activity, TrendingUp, Scale, Award, Percent, BarChart2 } from 'lucide-react';

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

// New data for 1 rep max lifts
const oneRepMaxData = [
  { name: 'Jan', bench: 185, squat: 275, deadlift: 315, overhead: 135 },
  { name: 'Feb', bench: 195, squat: 285, deadlift: 325, overhead: 140 },
  { name: 'Mar', bench: 200, squat: 295, deadlift: 335, overhead: 145 },
  { name: 'Apr', bench: 205, squat: 305, deadlift: 345, overhead: 150 },
  { name: 'May', bench: 210, squat: 315, deadlift: 355, overhead: 155 },
  { name: 'Jun', bench: 215, squat: 325, deadlift: 365, overhead: 160 },
];

// New data for physique goals progress
const chestProgressData = [
  { name: 'Jan', actual: 42, plan: 42 },
  { name: 'Feb', actual: 42.5, plan: 43 },
  { name: 'Mar', actual: 43, plan: 44 },
  { name: 'Apr', actual: 43.5, plan: 45 },
  { name: 'May', actual: 44, plan: 46 },
  { name: 'Jun', actual: 44, plan: 47 },
  { name: 'Jul', plan: 48 },
  { name: 'Aug', plan: 48 },
];

const armsProgressData = [
  { name: 'Jan', actual: 14, plan: 14 },
  { name: 'Feb', actual: 14.2, plan: 14.5 },
  { name: 'Mar', actual: 14.5, plan: 15 },
  { name: 'Apr', actual: 14.8, plan: 15.5 },
  { name: 'May', actual: 15, plan: 16 },
  { name: 'Jun', actual: 15, plan: 16.5 },
  { name: 'Jul', plan: 17 },
  { name: 'Aug', plan: 17 },
];

const shouldersProgressData = [
  { name: 'Jan', actual: 46, plan: 46 },
  { name: 'Feb', actual: 46.5, plan: 47 },
  { name: 'Mar', actual: 47, plan: 48 },
  { name: 'Apr', actual: 47.5, plan: 49 },
  { name: 'May', actual: 48, plan: 50 },
  { name: 'Jun', actual: 48, plan: 51 },
  { name: 'Jul', plan: 52 },
  { name: 'Aug', plan: 52 },
];

const waistProgressData = [
  { name: 'Jan', actual: 34, plan: 34 },
  { name: 'Feb', actual: 33.5, plan: 33.5 },
  { name: 'Mar', actual: 33, plan: 33 },
  { name: 'Apr', actual: 32.5, plan: 32.5 },
  { name: 'May', actual: 32, plan: 32 },
  { name: 'Jun', actual: 32, plan: 31.5 },
  { name: 'Jul', plan: 31 },
  { name: 'Aug', plan: 30 },
];

const bodyFatProgressData = [
  { name: 'Jan', actual: 18, plan: 18 },
  { name: 'Feb', actual: 17, plan: 17 },
  { name: 'Mar', actual: 16, plan: 16 },
  { name: 'Apr', actual: 15, plan: 15 },
  { name: 'May', actual: 14, plan: 14 },
  { name: 'Jun', actual: 14, plan: 13 },
  { name: 'Jul', plan: 12 },
  { name: 'Aug', plan: 10 },
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

// New component for physique progress charts
const PhysiqueProgressChart = ({ title, data, dataKey, goal }) => {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <h3 className="text-lg leading-6 font-medium text-gray-900">{title}</h3>
        <div className="mt-2 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#4f46e5" 
                strokeWidth={2}
                dot={{ r: 4 }} 
                name="Actual"
              />
              <Line 
                type="monotone" 
                dataKey="plan" 
                stroke="#9ca3af" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ r: 0 }} 
                name="Plan"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-2 text-sm text-gray-500 text-right">
          Goal: {goal}
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
          title="Body Fat" 
          value="14%" 
          icon={Percent} 
          change="1%" 
          trend="down" 
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

        {/* 1 Rep Max Chart */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <BarChart2 className="mr-2 h-5 w-5 text-indigo-500" />
              1 Rep Max Estimates
            </h3>
            <div className="mt-2 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={oneRepMaxData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="bench" stroke="#4f46e5" strokeWidth={2} name="Bench Press" />
                  <Line type="monotone" dataKey="squat" stroke="#ef4444" strokeWidth={2} name="Squat" />
                  <Line type="monotone" dataKey="deadlift" stroke="#10b981" strokeWidth={2} name="Deadlift" />
                  <Line type="monotone" dataKey="overhead" stroke="#f59e0b" strokeWidth={2} name="Overhead Press" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Physique Progress Charts */}
      <div className="mt-8">
        <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
          <Award className="mr-2 h-5 w-5 text-indigo-500" />
          Progress Towards Superhero Physique
        </h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <PhysiqueProgressChart 
            title="Chest Progress" 
            data={chestProgressData} 
            dataKey="chest" 
            goal="48 inches"
          />
          <PhysiqueProgressChart 
            title="Arms Progress" 
            data={armsProgressData} 
            dataKey="arms" 
            goal="17 inches"
          />
          <PhysiqueProgressChart 
            title="Shoulders Progress" 
            data={shouldersProgressData} 
            dataKey="shoulders" 
            goal="52 inches"
          />
          <PhysiqueProgressChart 
            title="Waist Progress" 
            data={waistProgressData} 
            dataKey="waist" 
            goal="30 inches"
          />
          <PhysiqueProgressChart 
            title="Body Fat Progress" 
            data={bodyFatProgressData} 
            dataKey="bodyFat" 
            goal="10%"
          />
        </div>
      </div>

      {/* Weekly Workouts and Nutrition */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
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