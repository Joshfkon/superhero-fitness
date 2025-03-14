import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Scale, BarChart2 } from 'lucide-react';
import { ChartCard } from '../components';

const ChartsSection = ({ weightData, oneRepMaxData }) => {
  return (
    <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Weight Trend Chart */}
      <ChartCard title="Weight Trend" icon={Scale}>
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
      </ChartCard>

      {/* 1 Rep Max Chart */}
      <ChartCard title="1 Rep Max Estimates" icon={BarChart2}>
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
      </ChartCard>
    </div>
  );
};

export default ChartsSection; 