import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Dumbbell, Apple } from 'lucide-react';
import { ChartCard } from '../components';

const WorkoutsNutritionSection = ({ workoutData, nutritionData }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Weekly Workouts Chart */}
      <ChartCard title="Weekly Workouts" icon={Dumbbell}>
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
      </ChartCard>

      {/* Nutrition Chart */}
      <ChartCard title="Weekly Nutrition" icon={Apple}>
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
      </ChartCard>
    </div>
  );
};

export default WorkoutsNutritionSection; 