import React from 'react';
import { Award } from 'lucide-react';
import { iconMap } from './constants';
import { StatsSection, ChartsSection, PhysiqueProgressSection, WorkoutsNutritionSection } from './sections';
import dashboardData from './data/dashboardData.json';

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Overview of your fitness journey and progress towards your superhero physique
      </p>

      {/* Stats Overview */}
      <StatsSection stats={dashboardData.stats} iconMap={iconMap} />

      {/* Main Charts */}
      <ChartsSection weightData={dashboardData.weightData} oneRepMaxData={dashboardData.oneRepMaxData} />

      {/* Physique Progress Charts */}
      <PhysiqueProgressSection 
        title="Progress Towards Superhero Physique"
        icon={Award}
        physiqueProgress={dashboardData.physiqueProgress}
        goals={dashboardData.goals}
      />

      {/* Weekly Workouts and Nutrition */}
      <WorkoutsNutritionSection 
        workoutData={dashboardData.workoutData}
        nutritionData={dashboardData.nutritionData}
      />
    </div>
  );
};

export default Dashboard;