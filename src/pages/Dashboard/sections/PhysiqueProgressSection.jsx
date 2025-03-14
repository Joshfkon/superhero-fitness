import React from 'react';
import { PhysiqueProgressChart } from '../components';

const PhysiqueProgressSection = ({ title, icon: Icon, physiqueProgress, goals }) => {
  // Define the metrics we want to display
  const metrics = [
    { id: 'chest', title: 'Chest Progress' },
    { id: 'arms', title: 'Arms Progress' },
    { id: 'shoulders', title: 'Shoulders Progress' },
    { id: 'waist', title: 'Waist Progress' },
    { id: 'bodyFat', title: 'Body Fat Progress' }
  ];

  return (
    <div className="mt-8">
      <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
        {Icon && <Icon className="mr-2 h-5 w-5 text-indigo-500" />}
        {title}
      </h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map(metric => (
          <PhysiqueProgressChart 
            key={metric.id}
            title={metric.title} 
            data={physiqueProgress[metric.id]} 
            dataKey={metric.id} 
            goal={goals[metric.id]}
          />
        ))}
      </div>
    </div>
  );
};

export default PhysiqueProgressSection; 