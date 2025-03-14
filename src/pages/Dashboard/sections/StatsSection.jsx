import React from 'react';
import { StatCard } from '../components';

const StatsSection = ({ stats, iconMap }) => {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard 
          key={index}
          title={stat.title} 
          value={stat.value} 
          icon={iconMap[stat.icon]} 
          change={stat.change} 
          trend={stat.trend} 
        />
      ))}
    </div>
  );
};

export default StatsSection; 