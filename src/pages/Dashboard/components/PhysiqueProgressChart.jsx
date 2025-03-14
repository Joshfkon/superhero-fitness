import React from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Card from '../../../components/common/Card';

const PhysiqueProgressChart = ({ title, data, dataKey, goal }) => {
  return (
    <Card>
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
    </Card>
  );
};

export default PhysiqueProgressChart; 