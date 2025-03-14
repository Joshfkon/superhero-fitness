import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  Target, 
  Dumbbell, 
  Scale, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  CalendarClock, 
  ArrowRight, 
  Award, 
  BarChart,
  Ruler,
  Flame,
  AppleIcon,
  AlertCircle,
  Save,
  RefreshCw,
  Zap,
  ChevronRight
} from 'lucide-react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

// Sample measurement history
const sampleMeasurementHistory = [
  {
    date: '2023-01-01',
    weight: 185,
    bodyFat: 18,
    chest: 42,
    waist: 34,
    arms: 14.1,
    shoulders: 46,
    tdee: 2800
  },
  {
    date: '2023-02-01',
    weight: 183,
    bodyFat: 17,
    chest: 42.5,
    waist: 33.5,
    arms: 14.3,
    shoulders: 46.5,
    tdee: 2750
  },
  {
    date: '2023-03-01',
    weight: 181,
    bodyFat: 16,
    chest: 43,
    waist: 33,
    arms: 14.6,
    shoulders: 47,
    tdee: 2700
  },
  {
    date: '2023-04-01',
    weight: 180,
    bodyFat: 15,
    chest: 43.5,
    waist: 32.5,
    arms: 14.9,
    shoulders: 47.5,
    tdee: 2680
  },
  {
    date: '2023-05-01',
    weight: 178,
    bodyFat: 14,
    chest: 44,
    waist: 32,
    arms: 15.1,
    shoulders: 48,
    tdee: 2650
  },
  {
    date: '2023-06-01',
    weight: 176,
    bodyFat: 14,
    chest: 44,
    waist: 32,
    arms: 15.1,
    shoulders: 48,
    tdee: 2630
  }
];

// Training plan templates
const trainingPlans = [
  {
    id: 1,
    name: "Superhero Split",
    type: "Split",
    focusArea: "Overall Development",
    daysPerWeek: 5,
    description: "A 5-day split targeting different muscle groups each day for maximum growth.",
    idealFor: "Intermediate to advanced lifters looking for a balanced physique.",
    schedule: [
      { day: "Monday", focus: "Chest & Triceps", workingSets: 16 },
      { day: "Tuesday", focus: "Back & Biceps", workingSets: 16 },
      { day: "Wednesday", focus: "Legs & Calves", workingSets: 18 },
      { day: "Thursday", focus: "Shoulders & Abs", workingSets: 14 },
      { day: "Friday", focus: "Arms & Weakpoints", workingSets: 16 },
      { day: "Saturday", focus: "Rest", workingSets: 0 },
      { day: "Sunday", focus: "Rest", workingSets: 0 }
    ]
  },
  {
    id: 2,
    name: "Full Body Focus",
    type: "Full Body",
    focusArea: "Functional Strength",
    daysPerWeek: 3,
    description: "A 3-day full body program that emphasizes compound movements for overall development.",
    idealFor: "Beginners or those with limited training time looking for efficiency.",
    schedule: [
      { day: "Monday", focus: "Full Body A", workingSets: 15 },
      { day: "Tuesday", focus: "Rest", workingSets: 0 },
      { day: "Wednesday", focus: "Full Body B", workingSets: 15 },
      { day: "Thursday", focus: "Rest", workingSets: 0 },
      { day: "Friday", focus: "Full Body C", workingSets: 15 },
      { day: "Saturday", focus: "Rest", workingSets: 0 },
      { day: "Sunday", focus: "Rest", workingSets: 0 }
    ]
  },
  {
    id: 3,
    name: "Upper/Lower Power",
    type: "Upper/Lower",
    focusArea: "Strength & Hypertrophy",
    daysPerWeek: 4,
    description: "A 4-day upper/lower split that alternates between strength and hypertrophy focus.",
    idealFor: "Intermediate lifters wanting to build both strength and size.",
    schedule: [
      { day: "Monday", focus: "Upper (Power)", workingSets: 16 },
      { day: "Tuesday", focus: "Lower (Power)", workingSets: 14 },
      { day: "Wednesday", focus: "Rest", workingSets: 0 },
      { day: "Thursday", focus: "Upper (Hypertrophy)", workingSets: 18 },
      { day: "Friday", focus: "Lower (Hypertrophy)", workingSets: 16 },
      { day: "Saturday", focus: "Rest", workingSets: 0 },
      { day: "Sunday", focus: "Rest", workingSets: 0 }
    ]
  },
  {
    id: 4,
    name: "Push/Pull/Legs",
    type: "PPL",
    focusArea: "Balanced Development",
    daysPerWeek: 6,
    description: "A high-frequency program that hits each muscle group twice per week.",
    idealFor: "Dedicated lifters with good recovery who can train 6 days per week.",
    schedule: [
      { day: "Monday", focus: "Push", workingSets: 15 },
      { day: "Tuesday", focus: "Pull", workingSets: 15 },
      { day: "Wednesday", focus: "Legs", workingSets: 15 },
      { day: "Thursday", focus: "Push", workingSets: 15 },
      { day: "Friday", focus: "Pull", workingSets: 15 },
      { day: "Saturday", focus: "Legs", workingSets: 15 },
      { day: "Sunday", focus: "Rest", workingSets: 0 }
    ]
  }
];

// Nutrition plan templates
const nutritionPlans = [
  {
    id: "cutting",
    name: "Fat Loss Focus",
    calorieAdjustment: -500,
    proteinPerPound: 1.2,
    carbPercentage: 30,
    fatPercentage: 25,
    mealFrequency: 4,
    description: "A moderate calorie deficit with high protein to preserve muscle while losing fat.",
    recommendations: [
      "Prioritize protein with every meal",
      "Focus on fiber-rich vegetables for satiety",
      "Time carbs around workouts",
      "Stay hydrated with 3-4 liters of water daily",
      "Consider intermittent fasting if it helps manage hunger"
    ]
  },
  {
    id: "bulking",
    name: "Muscle Growth Focus",
    calorieAdjustment: 300,
    proteinPerPound: 1.0,
    carbPercentage: 45,
    fatPercentage: 25,
    mealFrequency: 5,
    description: "A moderate calorie surplus with higher carbs to fuel intense training and growth.",
    recommendations: [
      "Prioritize whole food sources",
      "Distribute protein evenly throughout the day",
      "Consume a post-workout meal with protein and carbs",
      "Ensure adequate micronutrients through varied diet",
      "Track progress weekly and adjust calories if weight gain stalls"
    ]
  },
  {
    id: "recomp",
    name: "Body Recomposition Focus",
    calorieAdjustment: 0,
    proteinPerPound: 1.1,
    carbPercentage: 35,
    fatPercentage: 30,
    mealFrequency: 4,
    description: "A maintenance calorie plan with cycling between surplus on training days and deficit on rest days.",
    recommendations: [
      "Eat at maintenance overall, but slightly higher on training days",
      "Prioritize protein consistency every day",
      "Time carbs around workouts",
      "Be patient - recomposition is slower than dedicated cutting or bulking",
      "Focus on performance improvements in the gym"
    ]
  }
];

const AITrainingPlan = () => {
  // State for current view
  const [activeTab, setActiveTab] = useState('assessment');
  
  // Assessment state
  const [expandedSections, setExpandedSections] = useState({
    goals: true,
    personal: false,
    training: false,
    aiCoach: false
  });
  const [userInfo, setUserInfo] = useState({
    age: 30,
    gender: 'male',
    height: 72, // in inches
    activityLevel: 'moderate',
    experience: 'intermediate',
    goalPhysique: 'athletic',
    daysPerWeek: 4,
    sessionsPerWeek: 4,
    sessionDuration: 60,
    preferredTraining: 'balanced',
    focusAreas: ['chest', 'arms'],
    wristSize: 7, // in inches
    dreamPhysique: 'athletic',
    primaryGoal: 'aesthetics',
    healthGoals: ['bloodPressure', 'energy'],
    timeframe: 'moderate'
  });

  // Current measurements
  const [currentMeasurements, setCurrentMeasurements] = useState(
    sampleMeasurementHistory[sampleMeasurementHistory.length - 1]
  );
  
  // Goal measurements
  const [goalMeasurements, setGoalMeasurements] = useState({
    weight: 170,
    bodyFat: 10,
    chest: 48,
    waist: 30,
    arms: 17,
    shoulders: 52,
    targetDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]
  });
  
  // AI recommendations
  const [recommendations, setRecommendations] = useState({
    approach: 'cutting',
    tdee: 2600,
    targetCalories: 2100,
    macros: {
      protein: 176,
      carbs: 158,
      fat: 70
    },
    adjustments: [],
    trainingPlan: null,
    weeklyWorkingSets: {
      chest: 16,
      back: 16,
      legs: 18,
      shoulders: 12,
      arms: 16
    }
  });
  
  // UI state
  const [isCalculating, setIsCalculating] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isAdjustingPlan, setIsAdjustingPlan] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Toggle section expansion
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };
  
  // Handle user info change
  const handleUserInfoChange = (field, value) => {
    setUserInfo({
      ...userInfo,
      [field]: value
    });
  };
  
  // Handle current measurement change
  const handleMeasurementChange = (field, value) => {
    setCurrentMeasurements({
      ...currentMeasurements,
      [field]: value
    });
  };
  
  // Handle goal measurement change
  const handleGoalChange = (field, value) => {
    setGoalMeasurements({
      ...goalMeasurements,
      [field]: value
    });
  };
  
  // Toggle focus area selection
  const toggleFocusArea = (area) => {
    const focusAreas = [...userInfo.focusAreas];
    
    if (focusAreas.includes(area)) {
      // Remove area if already selected
      const index = focusAreas.indexOf(area);
      focusAreas.splice(index, 1);
    } else {
      // Add area if not already selected (max 3)
      if (focusAreas.length < 3) {
        focusAreas.push(area);
      }
    }
    
    setUserInfo({
      ...userInfo,
      focusAreas
    });
  };
  
  // Calculate AI recommendations based on user data
  const calculateRecommendations = () => {
    setIsCalculating(true);
    setError('');
    
    // In a real app, this would make an API call to a backend service
    // For this demo, we'll simulate the calculation
    setTimeout(() => {
      try {
        // Determine if cutting, bulking, or recomp
        let approach;
        let targetCalories;
        
        // Calculate estimated TDEE (Total Daily Energy Expenditure)
        const activityMultiplier = 
          userInfo.activityLevel === 'sedentary' ? 1.2 :
          userInfo.activityLevel === 'light' ? 1.375 :
          userInfo.activityLevel === 'moderate' ? 1.55 :
          userInfo.activityLevel === 'active' ? 1.725 : 1.9;
        
        // Basic BMR calculation using Mifflin-St Jeor Equation
        const bmr = userInfo.gender === 'male'
          ? 10 * currentMeasurements.weight * 0.453592 + 6.25 * userInfo.height * 2.54 - 5 * userInfo.age + 5
          : 10 * currentMeasurements.weight * 0.453592 + 6.25 * userInfo.height * 2.54 - 5 * userInfo.age - 161;
        
        const tdee = Math.round(bmr * activityMultiplier);
        
        // Determine approach based on current vs goal measurements
        const currentBF = currentMeasurements.bodyFat;
        const goalBF = goalMeasurements.bodyFat;
        
        if (currentBF - goalBF > 3) {
          // If we need to lose more than 3% body fat, cut
          approach = 'cutting';
          targetCalories = tdee - 500;
        } else if (goalBF - currentBF > 0) {
          // If we need to gain body fat (rare), bulk
          approach = 'bulking';
          targetCalories = tdee + 300;
        } else if (
          goalMeasurements.chest > currentMeasurements.chest + 1 ||
          goalMeasurements.arms > currentMeasurements.arms + 0.5 ||
          goalMeasurements.shoulders > currentMeasurements.shoulders + 1
        ) {
          // If we need significant muscle gain, bulk
          approach = 'bulking';
          targetCalories = tdee + 300;
        } else {
          // Otherwise, recomp
          approach = 'recomp';
          targetCalories = tdee;
        }
        
        // Calculate macros
        const nutritionPlan = nutritionPlans.find(plan => plan.id === approach);
        const proteinGrams = Math.round(currentMeasurements.weight * nutritionPlan.proteinPerPound);
        const proteinCalories = proteinGrams * 4;
        
        const remainingCalories = targetCalories - proteinCalories;
        const carbCalories = Math.round(targetCalories * (nutritionPlan.carbPercentage / 100));
        const fatCalories = Math.round(targetCalories * (nutritionPlan.fatPercentage / 100));
        
        const carbGrams = Math.round(carbCalories / 4);
        const fatGrams = Math.round(fatCalories / 9);
        
        // Select training plan based on user preferences
        let bestPlanMatch = null;
        let bestPlanScore = -1;
        
        trainingPlans.forEach(plan => {
          let score = 0;
          
          // Match on days per week (most important)
          if (plan.daysPerWeek === userInfo.daysPerWeek) {
            score += 5;
          } else {
            score -= Math.abs(plan.daysPerWeek - userInfo.daysPerWeek);
          }
          
          // Match on experience level
          if (
            (userInfo.experience === 'beginner' && plan.name.includes('Full Body')) ||
            (userInfo.experience === 'intermediate' && (plan.name.includes('Upper/Lower') || plan.name.includes('Split'))) ||
            (userInfo.experience === 'advanced' && (plan.name.includes('Split') || plan.name.includes('PPL')))
          ) {
            score += 3;
          }
          
          // Match on focus areas
          if (
            (userInfo.focusAreas.includes('chest') && plan.schedule.some(day => day.focus.includes('Chest') || day.focus.includes('Push'))) ||
            (userInfo.focusAreas.includes('back') && plan.schedule.some(day => day.focus.includes('Back') || day.focus.includes('Pull'))) ||
            (userInfo.focusAreas.includes('legs') && plan.schedule.some(day => day.focus.includes('Legs'))) ||
            (userInfo.focusAreas.includes('shoulders') && plan.schedule.some(day => day.focus.includes('Shoulders'))) ||
            (userInfo.focusAreas.includes('arms') && (plan.schedule.some(day => day.focus.includes('Arms') || day.focus.includes('Push') || day.focus.includes('Pull'))))
          ) {
            score += 2;
          }
          
          if (score > bestPlanScore) {
            bestPlanScore = score;
            bestPlanMatch = plan;
          }
        });
        
        // Weekly working sets based on focus areas and experience
        const baseVolume = 
          userInfo.experience === 'beginner' ? 10 :
          userInfo.experience === 'intermediate' ? 14 :
          userInfo.experience === 'advanced' ? 16 : 12;
          
        const weeklyWorkingSets = {
          chest: baseVolume,
          back: baseVolume,
          legs: baseVolume + 2,  // Legs typically need more volume
          shoulders: baseVolume - 2,  // Shoulders typically need less direct volume
          arms: baseVolume - 2  // Arms get indirect work
        };
        
        // Increase volume for focus areas
        userInfo.focusAreas.forEach(area => {
          weeklyWorkingSets[area] += 4;  // Add 4 sets for focus areas
        });
        
        // Set recommendations
        setRecommendations({
          approach,
          tdee,
          targetCalories,
          macros: {
            protein: proteinGrams,
            carbs: carbGrams,
            fat: fatGrams
          },
          adjustments: [],
          trainingPlan: bestPlanMatch,
          weeklyWorkingSets
        });
        
        // Clear error and show success
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        
        // Switch to the plan tab
        setActiveTab('plan');
      } catch (err) {
        console.error('Error calculating recommendations:', err);
        setError('Failed to calculate recommendations. Please try again.');
      } finally {
        setIsCalculating(false);
      }
    }, 2000);  // Simulate API delay
  };
  
  // Generate full training plan
  const generateFullPlan = () => {
    setIsGeneratingPlan(true);
    setError('');
    
    // In a real app, this would make an API call to generate a complete plan
    // For this demo, we'll simulate the process
    setTimeout(() => {
      // In a real app, this would return full workout details
      setIsGeneratingPlan(false);
      
      // Here we would normally set some state with the generated plan
      // But for this demo, we'll just show a success message
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 2500);
  };
  
  // Adjust plan based on progress
  const adjustPlan = () => {
    setIsAdjustingPlan(true);
    setError('');
    
    // In a real app, this would analyze recent measurements and adjust the plan
    // For this demo, we'll simulate the process
    setTimeout(() => {
      try {
        // Sample adjustment: if weight loss stalled, reduce calories by 10%
        const newAdjustments = [...recommendations.adjustments];
        
        newAdjustments.push({
          date: new Date().toISOString().split('T')[0],
          change: "Reduced daily calories by 100 to overcome plateau",
          reason: "Weight loss has stalled for the past 2 weeks"
        });
        
        setRecommendations({
          ...recommendations,
          targetCalories: recommendations.targetCalories - 100,
          adjustments: newAdjustments
        });
        
        // Show success
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (err) {
        console.error('Error adjusting plan:', err);
        setError('Failed to adjust plan. Please try again.');
      } finally {
        setIsAdjustingPlan(false);
      }
    }, 2000);
  };
  
  // Calculate time to goal
  const calculateTimeToGoal = () => {
    // For weight loss, assume 1-2 lbs per week
    // For muscle gain, assume about 1-2 lbs per month
    
    const currentDate = new Date();
    const targetDate = new Date(goalMeasurements.targetDate);
    const weeksRemaining = Math.max(1, Math.round((targetDate - currentDate) / (7 * 24 * 60 * 60 * 1000)));
    
    let feasibility = "on track";
    let message = "";
    
    if (recommendations.approach === 'cutting') {
      // Calculating for fat loss
      const weightToLose = currentMeasurements.weight - goalMeasurements.weight;
      const maxWeightLossRate = 2; // 2 lbs per week max
      const minWeeksNeeded = Math.ceil(weightToLose / maxWeightLossRate);
      
      if (minWeeksNeeded > weeksRemaining) {
        feasibility = "challenging";
        message = `Your goal may be too aggressive. A safer rate would be ${maxWeightLossRate} lbs per week, requiring at least ${minWeeksNeeded} weeks.`;
      } else {
        message = `Your goal is achievable within your timeframe. You need to lose about ${(weightToLose / weeksRemaining).toFixed(1)} lbs per week.`;
      }
    } else if (recommendations.approach === 'bulking') {
      // Calculating for muscle gain
      const weightToGain = goalMeasurements.weight - currentMeasurements.weight;
      const maxMuscleGainRate = 0.5; // 0.5 lbs per week max for natural lifters
      const minWeeksNeeded = Math.ceil(weightToGain / maxMuscleGainRate);
      
      if (minWeeksNeeded > weeksRemaining) {
        feasibility = "challenging";
        message = `Your muscle gain goal may be too aggressive. A realistic rate is ${maxMuscleGainRate} lbs per week, requiring at least ${minWeeksNeeded} weeks.`;
      } else {
        message = `Your goal is achievable within your timeframe. You need to gain about ${(weightToGain / weeksRemaining).toFixed(1)} lbs per week.`;
      }
    } else {
      // Recomp calculations
      message = "Body recomposition is a slower process than dedicated cutting or bulking. Your timeframe seems reasonable, but be patient with progress.";
    }
    
    return { feasibility, message, weeksRemaining };
  };
  
  // Prepare chart data
  const getProgressChartData = () => {
    // Create projection based on recommendation approach
    const data = [...sampleMeasurementHistory];
    
    // Add projections
    const lastMeasurement = data[data.length - 1];
    const targetDate = new Date(goalMeasurements.targetDate);
    const lastDate = new Date(lastMeasurement.date);
    const weeksBetween = Math.max(1, Math.round((targetDate - lastDate) / (7 * 24 * 60 * 60 * 1000)));
    
    // Weekly changes
    const weeklyWeightChange = (goalMeasurements.weight - lastMeasurement.weight) / weeksBetween;
    const weeklyBodyFatChange = (goalMeasurements.bodyFat - lastMeasurement.bodyFat) / weeksBetween;
    
    // Add projection points (one per month)
    const monthsToAdd = Math.ceil(weeksBetween / 4);
    
    for (let i = 1; i <= monthsToAdd; i++) {
      const projectionDate = new Date(lastDate);
      projectionDate.setMonth(projectionDate.getMonth() + i);
      
      // Don't go past target date
      if (projectionDate > targetDate) {
        projectionDate.setTime(targetDate.getTime());
      }
      
      const weeksFromLast = Math.round((projectionDate - lastDate) / (7 * 24 * 60 * 60 * 1000));
      
      data.push({
        date: projectionDate.toISOString().split('T')[0],
        weight: parseFloat((lastMeasurement.weight + (weeklyWeightChange * weeksFromLast)).toFixed(1)),
        bodyFat: parseFloat((lastMeasurement.bodyFat + (weeklyBodyFatChange * weeksFromLast)).toFixed(1)),
        projected: true
      });
    }
    
    // Format for chart
    return data.map(record => ({
      date: new Date(record.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      weight: record.weight,
      bodyFat: record.bodyFat,
      projected: record.projected || false
    }));
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };
  
  // Handle dream physique selection
  const handleDreamPhysiqueSelect = (type) => {
    setUserInfo({
      ...userInfo,
      dreamPhysique: type
    });
  };
  
  // Toggle health goal selection
  const toggleHealthGoal = (goal) => {
    const healthGoals = [...userInfo.healthGoals];
    
    if (healthGoals.includes(goal)) {
      // Remove goal if already selected
      const index = healthGoals.indexOf(goal);
      healthGoals.splice(index, 1);
    } else {
      // Add goal if not already selected
      healthGoals.push(goal);
    }
    
    setUserInfo({
      ...userInfo,
      healthGoals
    });
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-semibold text-gray-900 flex items-center">
        <Brain className="mr-2 h-6 w-6 text-indigo-600" />
        AI Training Plan
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Your personalized training and nutrition strategy powered by AI
      </p>
      
      {error && (
        <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {showSuccess && (
        <div className="mt-4 bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircle className="h-5 w-5 text-green-400" />
            </div>
            <p className="ml-3 text-sm text-green-700">Calculation completed successfully!</p>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'assessment'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('assessment')}
          >
            Assessment
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plan'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('plan')}
          >
            Your Plan
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'progress'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('progress')}
          >
            Progress & Adjustments
          </button>
        </nav>
      </div>
      
      {/* Assessment Tab */}
      {activeTab === 'assessment' && (
        <div className="mt-6">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Create Your AI Training Plan</h3>
              <p className="mt-1 text-sm text-gray-500">
                Fill out the details below so our AI can create a personalized plan based on your current state, goals, and preferences.
              </p>
              
              {/* AI Coach Section */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => toggleSection('aiCoach')}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Brain className="mr-2 h-5 w-5 text-indigo-500" />
                    AI Coach Goal Setting
                  </h3>
                  {expandedSections.aiCoach ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.aiCoach && (
                  <div className="mt-4">
                    <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Brain className="h-6 w-6 text-indigo-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-md font-medium text-indigo-900">AI Coach</h4>
                          <p className="mt-1 text-sm text-indigo-700">
                            Let's figure out exactly what you want to achieve. I'll help you set realistic goals based on your body type and preferences.
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      {/* Primary Goal */}
                      <div className="sm:col-span-2">
                        <fieldset>
                          <legend className="block text-sm font-medium text-gray-700 mb-3">What's your primary goal?</legend>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div 
                              className={`relative rounded-lg border ${userInfo.primaryGoal === 'aesthetics' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex cursor-pointer focus:outline-none`}
                              onClick={() => handleUserInfoChange('primaryGoal', 'aesthetics')}
                            >
                              <div className="flex-1 flex">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    {userInfo.primaryGoal === 'aesthetics' && (
                                      <div className="h-5 w-5 text-indigo-600">
                                        <CheckCircle className="h-5 w-5" />
                                      </div>
                                    )}
                                    <span className={`ml-2 font-medium ${userInfo.primaryGoal === 'aesthetics' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                      Aesthetics
                                    </span>
                                  </div>
                                  <p className={`mt-1 text-sm ${userInfo.primaryGoal === 'aesthetics' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                    Look better, build muscle, lose fat
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div 
                              className={`relative rounded-lg border ${userInfo.primaryGoal === 'performance' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex cursor-pointer focus:outline-none`}
                              onClick={() => handleUserInfoChange('primaryGoal', 'performance')}
                            >
                              <div className="flex-1 flex">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    {userInfo.primaryGoal === 'performance' && (
                                      <div className="h-5 w-5 text-indigo-600">
                                        <CheckCircle className="h-5 w-5" />
                                      </div>
                                    )}
                                    <span className={`ml-2 font-medium ${userInfo.primaryGoal === 'performance' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                      Performance
                                    </span>
                                  </div>
                                  <p className={`mt-1 text-sm ${userInfo.primaryGoal === 'performance' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                    Get stronger, faster, more powerful
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div 
                              className={`relative rounded-lg border ${userInfo.primaryGoal === 'health' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex cursor-pointer focus:outline-none`}
                              onClick={() => handleUserInfoChange('primaryGoal', 'health')}
                            >
                              <div className="flex-1 flex">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    {userInfo.primaryGoal === 'health' && (
                                      <div className="h-5 w-5 text-indigo-600">
                                        <CheckCircle className="h-5 w-5" />
                                      </div>
                                    )}
                                    <span className={`ml-2 font-medium ${userInfo.primaryGoal === 'health' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                      Health
                                    </span>
                                  </div>
                                  <p className={`mt-1 text-sm ${userInfo.primaryGoal === 'health' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                    Improve biomarkers and overall wellness
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      
                      {/* Dream Physique */}
                      <div className="sm:col-span-2">
                        <fieldset>
                          <legend className="block text-sm font-medium text-gray-700 mb-3">What's your dream physique?</legend>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
                            <div 
                              className={`relative rounded-lg border ${userInfo.dreamPhysique === 'athletic' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex flex-col cursor-pointer focus:outline-none`}
                              onClick={() => handleDreamPhysiqueSelect('athletic')}
                            >
                              <div className="h-40 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                                <Dumbbell className="h-10 w-10 text-gray-400" />
                              </div>
                              <div className="flex items-center">
                                {userInfo.dreamPhysique === 'athletic' && (
                                  <div className="h-5 w-5 text-indigo-600">
                                    <CheckCircle className="h-5 w-5" />
                                  </div>
                                )}
                                <span className={`ml-2 font-medium ${userInfo.dreamPhysique === 'athletic' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                  Athletic
                                </span>
                              </div>
                              <p className={`mt-1 text-xs ${userInfo.dreamPhysique === 'athletic' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                Lean, defined muscles with good proportions
                              </p>
                            </div>
                            
                            <div 
                              className={`relative rounded-lg border ${userInfo.dreamPhysique === 'bodybuilder' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex flex-col cursor-pointer focus:outline-none`}
                              onClick={() => handleDreamPhysiqueSelect('bodybuilder')}
                            >
                              <div className="h-40 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                                <Dumbbell className="h-10 w-10 text-gray-400" />
                              </div>
                              <div className="flex items-center">
                                {userInfo.dreamPhysique === 'bodybuilder' && (
                                  <div className="h-5 w-5 text-indigo-600">
                                    <CheckCircle className="h-5 w-5" />
                                  </div>
                                )}
                                <span className={`ml-2 font-medium ${userInfo.dreamPhysique === 'bodybuilder' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                  Bodybuilder
                                </span>
                              </div>
                              <p className={`mt-1 text-xs ${userInfo.dreamPhysique === 'bodybuilder' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                Maximum muscle size with definition
                              </p>
                            </div>
                            
                            <div 
                              className={`relative rounded-lg border ${userInfo.dreamPhysique === 'powerlifter' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex flex-col cursor-pointer focus:outline-none`}
                              onClick={() => handleDreamPhysiqueSelect('powerlifter')}
                            >
                              <div className="h-40 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                                <Dumbbell className="h-10 w-10 text-gray-400" />
                              </div>
                              <div className="flex items-center">
                                {userInfo.dreamPhysique === 'powerlifter' && (
                                  <div className="h-5 w-5 text-indigo-600">
                                    <CheckCircle className="h-5 w-5" />
                                  </div>
                                )}
                                <span className={`ml-2 font-medium ${userInfo.dreamPhysique === 'powerlifter' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                  Powerlifter
                                </span>
                              </div>
                              <p className={`mt-1 text-xs ${userInfo.dreamPhysique === 'powerlifter' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                Strong, dense muscles with focus on power
                              </p>
                            </div>
                            
                            <div 
                              className={`relative rounded-lg border ${userInfo.dreamPhysique === 'lean' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex flex-col cursor-pointer focus:outline-none`}
                              onClick={() => handleDreamPhysiqueSelect('lean')}
                            >
                              <div className="h-40 bg-gray-200 rounded-md mb-3 flex items-center justify-center">
                                <Dumbbell className="h-10 w-10 text-gray-400" />
                              </div>
                              <div className="flex items-center">
                                {userInfo.dreamPhysique === 'lean' && (
                                  <div className="h-5 w-5 text-indigo-600">
                                    <CheckCircle className="h-5 w-5" />
                                  </div>
                                )}
                                <span className={`ml-2 font-medium ${userInfo.dreamPhysique === 'lean' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                  Very Lean
                                </span>
                              </div>
                              <p className={`mt-1 text-xs ${userInfo.dreamPhysique === 'lean' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                Extremely low body fat with visible definition
                              </p>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      
                      {/* Health Goals */}
                      {userInfo.primaryGoal === 'health' && (
                        <div className="sm:col-span-2">
                          <fieldset>
                            <legend className="block text-sm font-medium text-gray-700 mb-3">Which health markers are you trying to improve?</legend>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {[
                                {id: 'bloodPressure', label: 'Blood Pressure'},
                                {id: 'cholesterol', label: 'Cholesterol'},
                                {id: 'bloodSugar', label: 'Blood Sugar'},
                                {id: 'energy', label: 'Energy Levels'},
                                {id: 'sleep', label: 'Sleep Quality'},
                                {id: 'stress', label: 'Stress Management'},
                                {id: 'mobility', label: 'Mobility & Flexibility'},
                                {id: 'immunity', label: 'Immune Function'}
                              ].map((goal) => (
                                <button
                                  key={goal.id}
                                  type="button"
                                  onClick={() => toggleHealthGoal(goal.id)}
                                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    userInfo.healthGoals.includes(goal.id)
                                      ? 'bg-indigo-100 text-indigo-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}
                                >
                                  {goal.label}
                                  {userInfo.healthGoals.includes(goal.id) && (
                                    <CheckCircle className="ml-1.5 h-4 w-4" />
                                  )}
                                </button>
                              ))}
                            </div>
                          </fieldset>
                        </div>
                      )}
                      
                      {/* Body Structure Measurements */}
                      <div className="sm:col-span-2">
                        <fieldset>
                          <legend className="block text-sm font-medium text-gray-700 mb-3">Body Structure Measurements</legend>
                          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                            <div>
                              <label htmlFor="wrist-size" className="block text-sm font-medium text-gray-700">
                                Wrist Size (inches)
                              </label>
                              <input
                                type="number"
                                step="0.25"
                                id="wrist-size"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={userInfo.wristSize}
                                onChange={(e) => handleUserInfoChange('wristSize', parseFloat(e.target.value))}
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Helps determine your natural frame size
                              </p>
                            </div>
                            
                            <div>
                              <label htmlFor="ankle-size" className="block text-sm font-medium text-gray-700">
                                Ankle Size (inches)
                              </label>
                              <input
                                type="number"
                                step="0.25"
                                id="ankle-size"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                placeholder="Optional"
                              />
                              <p className="mt-1 text-xs text-gray-500">
                                Additional data point for frame assessment
                              </p>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      
                      {/* Timeframe */}
                      <div className="sm:col-span-2">
                        <fieldset>
                          <legend className="block text-sm font-medium text-gray-700 mb-3">How quickly do you want to achieve your goals?</legend>
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div 
                              className={`relative rounded-lg border ${userInfo.timeframe === 'aggressive' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex cursor-pointer focus:outline-none`}
                              onClick={() => handleUserInfoChange('timeframe', 'aggressive')}
                            >
                              <div className="flex-1 flex">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    {userInfo.timeframe === 'aggressive' && (
                                      <div className="h-5 w-5 text-indigo-600">
                                        <CheckCircle className="h-5 w-5" />
                                      </div>
                                    )}
                                    <span className={`ml-2 font-medium ${userInfo.timeframe === 'aggressive' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                      Aggressive
                                    </span>
                                  </div>
                                  <p className={`mt-1 text-sm ${userInfo.timeframe === 'aggressive' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                    Maximum results in minimum time
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div 
                              className={`relative rounded-lg border ${userInfo.timeframe === 'moderate' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex cursor-pointer focus:outline-none`}
                              onClick={() => handleUserInfoChange('timeframe', 'moderate')}
                            >
                              <div className="flex-1 flex">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    {userInfo.timeframe === 'moderate' && (
                                      <div className="h-5 w-5 text-indigo-600">
                                        <CheckCircle className="h-5 w-5" />
                                      </div>
                                    )}
                                    <span className={`ml-2 font-medium ${userInfo.timeframe === 'moderate' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                      Moderate
                                    </span>
                                  </div>
                                  <p className={`mt-1 text-sm ${userInfo.timeframe === 'moderate' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                    Balanced approach with steady progress
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            <div 
                              className={`relative rounded-lg border ${userInfo.timeframe === 'sustainable' ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-300'} p-4 flex cursor-pointer focus:outline-none`}
                              onClick={() => handleUserInfoChange('timeframe', 'sustainable')}
                            >
                              <div className="flex-1 flex">
                                <div className="flex flex-col">
                                  <div className="flex items-center">
                                    {userInfo.timeframe === 'sustainable' && (
                                      <div className="h-5 w-5 text-indigo-600">
                                        <CheckCircle className="h-5 w-5" />
                                      </div>
                                    )}
                                    <span className={`ml-2 font-medium ${userInfo.timeframe === 'sustainable' ? 'text-indigo-900' : 'text-gray-900'}`}>
                                      Sustainable
                                    </span>
                                  </div>
                                  <p className={`mt-1 text-sm ${userInfo.timeframe === 'sustainable' ? 'text-indigo-700' : 'text-gray-500'}`}>
                                    Gradual changes for long-term habits
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      
                      {/* AI Recommendations */}
                      <div className="sm:col-span-2 mt-4">
                        <div className="bg-indigo-50 p-4 rounded-lg">
                          <div className="flex">
                            <div className="flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <Brain className="h-6 w-6 text-indigo-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <h4 className="text-md font-medium text-indigo-900">AI Coach Recommendations</h4>
                              <p className="mt-1 text-sm text-indigo-700">
                                Based on your wrist size of {userInfo.wristSize}" and height of {Math.floor(userInfo.height/12)}'{userInfo.height%12}", 
                                you have a {userInfo.wristSize < 6.5 ? 'small' : userInfo.wristSize < 7.5 ? 'medium' : 'large'} frame.
                                
                                {userInfo.dreamPhysique === 'athletic' && " Your goal of an athletic physique is well-suited for your frame. I recommend focusing on balanced development with slightly more emphasis on shoulders and back for that V-taper look."}
                                {userInfo.dreamPhysique === 'bodybuilder' && " Your bodybuilder goal will require significant muscle mass. With your frame, focus on progressive overload and ensure adequate recovery and nutrition."}
                                {userInfo.dreamPhysique === 'powerlifter' && " For your powerlifter goal, we'll prioritize strength development with focus on the big compound lifts. Your frame is well-suited for developing power."}
                                {userInfo.dreamPhysique === 'lean' && " Your goal of a very lean physique will require disciplined nutrition. We'll create a plan that preserves muscle while reducing body fat."}
                              </p>
                              
                              <div className="mt-3 text-sm text-indigo-700">
                                <p className="font-medium">Realistic goals for your frame:</p>
                                <ul className="list-disc pl-5 mt-1 space-y-1">
                                  <li>Chest: {Math.round(userInfo.wristSize * 6.5)}" potential</li>
                                  <li>Arms: {(userInfo.wristSize * 2.5).toFixed(1)}" potential</li>
                                  <li>Ideal body weight range: {Math.round((userInfo.height - 100) * 2.2) - 10}-{Math.round((userInfo.height - 100) * 2.2) + 10} lbs</li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Body Goals Section */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => toggleSection('goals')}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Target className="mr-2 h-5 w-5 text-indigo-500" />
                    Body Goals & Measurements
                  </h3>
                  {expandedSections.goals ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.goals && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                      {/* Current Measurements */}
                      <div className="sm:col-span-1">
                        <fieldset>
                          <legend className="block text-sm font-medium text-gray-700 mb-3">Current Measurements</legend>
                          
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="current-weight" className="block text-sm font-medium text-gray-700">
                                Weight (lbs)
                              </label>
                              <input
                                type="number"
                                id="current-weight"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={currentMeasurements.weight}
                                onChange={(e) => handleMeasurementChange('weight', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="current-bodyfat" className="block text-sm font-medium text-gray-700">
                                Body Fat (%)
                              </label>
                              <input
                                type="number"
                                id="current-bodyfat"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={currentMeasurements.bodyFat}
                                onChange={(e) => handleMeasurementChange('bodyFat', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="current-chest" className="block text-sm font-medium text-gray-700">
                                Chest (inches)
                              </label>
                              <input
                                type="number"
                                id="current-chest"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={currentMeasurements.chest}
                                onChange={(e) => handleMeasurementChange('chest', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="current-waist" className="block text-sm font-medium text-gray-700">
                                Waist (inches)
                              </label>
                              <input
                                type="number"
                                id="current-waist"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={currentMeasurements.waist}
                                onChange={(e) => handleMeasurementChange('waist', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="current-arms" className="block text-sm font-medium text-gray-700">
                                Arms (inches)
                              </label>
                              <input
                                type="number"
                                id="current-arms"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={currentMeasurements.arms}
                                onChange={(e) => handleMeasurementChange('arms', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="current-shoulders" className="block text-sm font-medium text-gray-700">
                                Shoulders (inches)
                              </label>
                              <input
                                type="number"
                                id="current-shoulders"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={currentMeasurements.shoulders}
                                onChange={(e) => handleMeasurementChange('shoulders', parseFloat(e.target.value))}
                              />
                            </div>
                          </div>
                        </fieldset>
                      </div>
                      
                      {/* Goal Measurements */}
                      <div className="sm:col-span-1">
                        <fieldset>
                          <legend className="block text-sm font-medium text-gray-700 mb-3">Goal Measurements</legend>
                          
                          <div className="space-y-4">
                            <div>
                              <label htmlFor="goal-weight" className="block text-sm font-medium text-gray-700">
                                Target Weight (lbs)
                              </label>
                              <input
                                type="number"
                                id="goal-weight"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={goalMeasurements.weight}
                                onChange={(e) => handleGoalChange('weight', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="goal-bodyfat" className="block text-sm font-medium text-gray-700">
                                Target Body Fat (%)
                              </label>
                              <input
                                type="number"
                                id="goal-bodyfat"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={goalMeasurements.bodyFat}
                                onChange={(e) => handleGoalChange('bodyFat', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="goal-chest" className="block text-sm font-medium text-gray-700">
                                Target Chest (inches)
                              </label>
                              <input
                                type="number"
                                id="goal-chest"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={goalMeasurements.chest}
                                onChange={(e) => handleGoalChange('chest', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="goal-waist" className="block text-sm font-medium text-gray-700">
                                Target Waist (inches)
                              </label>
                              <input
                                type="number"
                                id="goal-waist"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={goalMeasurements.waist}
                                onChange={(e) => handleGoalChange('waist', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="goal-arms" className="block text-sm font-medium text-gray-700">
                                Target Arms (inches)
                              </label>
                              <input
                                type="number"
                                id="goal-arms"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={goalMeasurements.arms}
                                onChange={(e) => handleGoalChange('arms', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="goal-shoulders" className="block text-sm font-medium text-gray-700">
                                Target Shoulders (inches)
                              </label>
                              <input
                                type="number"
                                id="goal-shoulders"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={goalMeasurements.shoulders}
                                onChange={(e) => handleGoalChange('shoulders', parseFloat(e.target.value))}
                              />
                            </div>
                            
                            <div>
                              <label htmlFor="target-date" className="block text-sm font-medium text-gray-700">
                                Target Date
                              </label>
                              <input
                                type="date"
                                id="target-date"
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={goalMeasurements.targetDate}
                                onChange={(e) => handleGoalChange('targetDate', e.target.value)}
                              />
                            </div>
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Personal Information Section */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => toggleSection('personal')}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Scale className="mr-2 h-5 w-5 text-indigo-500" />
                    Personal Information
                  </h3>
                  {expandedSections.personal ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.personal && (
                  <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                        Age
                      </label>
                      <input
                        type="number"
                        id="age"
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={userInfo.age}
                        onChange={(e) => handleUserInfoChange('age', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                        Gender
                      </label>
                      <select
                        id="gender"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={userInfo.gender}
                        onChange={(e) => handleUserInfoChange('gender', e.target.value)}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                        Height (inches)
                      </label>
                      <input
                        type="number"
                        id="height"
                        className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={userInfo.height}
                        onChange={(e) => handleUserInfoChange('height', parseInt(e.target.value))}
                      />
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700">
                        Activity Level (Outside Workouts)
                      </label>
                      <select
                        id="activityLevel"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={userInfo.activityLevel}
                        onChange={(e) => handleUserInfoChange('activityLevel', e.target.value)}
                      >
                        <option value="sedentary">Sedentary (Office job, little movement)</option>
                        <option value="light">Lightly Active (Light walking)</option>
                        <option value="moderate">Moderately Active (Regular walking)</option>
                        <option value="active">Very Active (Physical job)</option>
                        <option value="athletic">Athletic (Physical job + sports)</option>
                      </select>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="experience" className="block text-sm font-medium text-gray-700">
                        Training Experience
                      </label>
                      <select
                        id="experience"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={userInfo.experience}
                        onChange={(e) => handleUserInfoChange('experience', e.target.value)}
                      >
                        <option value="beginner">Beginner (0-1 years)</option>
                        <option value="intermediate">Intermediate (1-3 years)</option>
                        <option value="advanced">Advanced (3+ years)</option>
                      </select>
                    </div>
                    
                    <div className="sm:col-span-3">
                      <label htmlFor="goalPhysique" className="block text-sm font-medium text-gray-700">
                        Goal Physique Type
                      </label>
                      <select
                        id="goalPhysique"
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={userInfo.goalPhysique}
                        onChange={(e) => handleUserInfoChange('goalPhysique', e.target.value)}
                      >
                        <option value="athletic">Athletic & Defined</option>
                        <option value="muscular">Muscular & Powerful</option>
                        <option value="lean">Very Lean & Cut</option>
                        <option value="balanced">Balanced & Proportional</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Training Preferences Section */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <button
                  type="button"
                  className="flex w-full items-center justify-between text-left"
                  onClick={() => toggleSection('training')}
                >
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5 text-indigo-500" />
                    Training Preferences
                  </h3>
                  {expandedSections.training ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                
                {expandedSections.training && (
                  <div className="mt-4">
                    <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                      <div className="sm:col-span-3">
                        <label htmlFor="daysPerWeek" className="block text-sm font-medium text-gray-700">
                          Preferred Training Days Per Week
                        </label>
                        <select
                          id="daysPerWeek"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={userInfo.daysPerWeek}
                          onChange={(e) => handleUserInfoChange('daysPerWeek', parseInt(e.target.value))}
                        >
                          <option value="3">3 days per week</option>
                          <option value="4">4 days per week</option>
                          <option value="5">5 days per week</option>
                          <option value="6">6 days per week</option>
                        </select>
                      </div>
                      
                      <div className="sm:col-span-3">
                        <label htmlFor="sessionDuration" className="block text-sm font-medium text-gray-700">
                          Preferred Session Duration
                        </label>
                        <select
                          id="sessionDuration"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={userInfo.sessionDuration}
                          onChange={(e) => handleUserInfoChange('sessionDuration', parseInt(e.target.value))}
                        >
                          <option value="45">45 minutes</option>
                          <option value="60">60 minutes</option>
                          <option value="75">75 minutes</option>
                          <option value="90">90 minutes</option>
                        </select>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <label htmlFor="preferredTraining" className="block text-sm font-medium text-gray-700">
                          Preferred Training Style
                        </label>
                        <select
                          id="preferredTraining"
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={userInfo.preferredTraining}
                          onChange={(e) => handleUserInfoChange('preferredTraining', e.target.value)}
                        >
                          <option value="balanced">Balanced (Strength & Hypertrophy)</option>
                          <option value="strength">Strength-Focused (Heavy, Lower Reps)</option>
                          <option value="hypertrophy">Hypertrophy-Focused (Moderate, Higher Reps)</option>
                          <option value="endurance">Endurance-Focused (Lighter, Very High Reps)</option>
                        </select>
                      </div>
                      
                      <div className="sm:col-span-6">
                        <fieldset>
                          <legend className="block text-sm font-medium text-gray-700">
                            Focus Areas (Select up to 3)
                          </legend>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {['chest', 'back', 'legs', 'shoulders', 'arms'].map((area) => (
                              <button
                                key={area}
                                type="button"
                                onClick={() => toggleFocusArea(area)}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                  userInfo.focusAreas.includes(area)
                                    ? 'bg-indigo-100 text-indigo-800'
                                    : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {area.charAt(0).toUpperCase() + area.slice(1)}
                                {userInfo.focusAreas.includes(area) && (
                                  <CheckCircle className="ml-1.5 h-4 w-4" />
                                )}
                              </button>
                            ))}
                          </div>
                        </fieldset>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  type="button"
                  onClick={calculateRecommendations}
                  disabled={isCalculating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {isCalculating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-4 w-4" />
                      Generate AI Plan
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Your Plan Tab */}
      {activeTab === 'plan' && (
        <div className="mt-6">
          {/* Summary Card */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <Target className="mr-2 h-5 w-5 text-indigo-500" />
                Plan Overview
              </h3>
              
              <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {/* Approach Card */}
                <div className="bg-indigo-50 rounded-lg px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <ChevronRight className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Recommended Approach</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {recommendations.approach === 'cutting' ? 'Fat Loss Focus' : 
                            recommendations.approach === 'bulking' ? 'Muscle Building Focus' : 'Body Recomposition'}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                
                {/* Timeline Card */}
                <div className="bg-green-50 rounded-lg px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <CalendarClock className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Timeline to Goal</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {calculateTimeToGoal().weeksRemaining} weeks
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
                
                {/* Training Plan Card */}
                <div className="bg-blue-50 rounded-lg px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <Dumbbell className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Recommended Plan</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {recommendations.trainingPlan?.name || "Custom Plan"}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className={`rounded-md ${
                  calculateTimeToGoal().feasibility === 'challenging' ? 'bg-yellow-50' : 'bg-green-50'
                } p-4`}>
                  <div className="flex">
                    <div className="flex-shrink-0">
                      {calculateTimeToGoal().feasibility === 'challenging' ? (
                        <AlertCircle className="h-5 w-5 text-yellow-400" />
                      ) : (
                        <CheckCircle className="h-5 w-5 text-green-400" />
                      )}
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm ${
                        calculateTimeToGoal().feasibility === 'challenging' ? 'text-yellow-700' : 'text-green-700'
                      }`}>
                        {calculateTimeToGoal().message}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Nutrition Plan Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <AppleIcon className="mr-2 h-5 w-5 text-indigo-500" />
                  Nutrition Plan
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {nutritionPlans.find(plan => plan.id === recommendations.approach)?.description}
                </p>
              </div>
            </div>
            <div className="border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                <div className="px-4 py-5 sm:px-6 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">
                      Estimated TDEE
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">
                      {recommendations.tdee} calories
                    </dd>
                    <dd className="mt-1 text-sm text-gray-500">
                      Your daily energy expenditure based on activity level
                    </dd>
                  </dl>
                </div>
                
                <div className="px-4 py-5 sm:px-6 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">
                      Target Daily Calories
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">
                      {recommendations.targetCalories} calories
                    </dd>
                    <dd className="mt-1 text-sm text-gray-500">
                      {recommendations.approach === 'cutting' ? 'Caloric deficit for fat loss' : 
                       recommendations.approach === 'bulking' ? 'Caloric surplus for muscle gain' : 
                       'Maintenance calories for recomposition'}
                    </dd>
                  </dl>
                </div>
                
                <div className="px-4 py-5 sm:px-6 border-b sm:border-b-0 sm:border-r border-gray-200">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">
                      Protein Target
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">
                      {recommendations.macros.protein}g
                    </dd>
                    <dd className="mt-1 text-sm text-gray-500">
                      {(recommendations.macros.protein * 4).toFixed(0)} calories from protein
                    </dd>
                  </dl>
                </div>
                
                <div className="px-4 py-5 sm:px-6">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500">
                      Carbs / Fat Targets
                    </dt>
                    <dd className="mt-1 text-xl font-semibold text-gray-900">
                      {recommendations.macros.carbs}g / {recommendations.macros.fat}g
                    </dd>
                    <dd className="mt-1 text-sm text-gray-500">
                      {(recommendations.macros.carbs * 4).toFixed(0)} cal / {(recommendations.macros.fat * 9).toFixed(0)} cal
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <h4 className="text-sm font-medium text-gray-500">Nutrition Recommendations</h4>
              <ul className="mt-2 divide-y divide-gray-200">
                {nutritionPlans.find(plan => plan.id === recommendations.approach)?.recommendations.map((rec, index) => (
                  <li key={index} className="py-2 flex">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-sm text-gray-600">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Training Plan Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Dumbbell className="mr-2 h-5 w-5 text-indigo-500" />
                  Training Plan
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  {recommendations.trainingPlan?.description || "Customized training plan based on your goals and preferences"}
                </p>
              </div>
              <button
                type="button"
                onClick={generateFullPlan}
                disabled={isGeneratingPlan}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isGeneratingPlan ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Generate Full Plan
                  </>
                )}
              </button>
            </div>
            
            {recommendations.trainingPlan && (
              <div className="border-t border-gray-200">
                <div className="px-4 py-5 sm:px-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Weekly Schedule</h4>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7">
                    {recommendations.trainingPlan.schedule.map((day, index) => (
                      <div 
                        key={index} 
                        className={`px-4 py-4 rounded-lg border ${
                          day.workingSets > 0 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'bg-gray-50 border-gray-200'
                        }`}
                      >
                        <h5 className="font-medium text-gray-900">{day.day}</h5>
                        <p className={`text-sm ${day.workingSets > 0 ? 'text-blue-700' : 'text-gray-500'}`}>
                          {day.focus}
                        </p>
                        {day.workingSets > 0 && (
                          <div className="mt-2 flex items-center text-xs text-gray-500">
                            <BarChart className="h-4 w-4 mr-1" />
                            {day.workingSets} working sets
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <h4 className="text-sm font-medium text-gray-500 mb-3">Weekly Volume By Muscle Group</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <ReBarChart
                        data={[
                          { name: 'Chest', sets: recommendations.weeklyWorkingSets.chest },
                          { name: 'Back', sets: recommendations.weeklyWorkingSets.back },
                          { name: 'Legs', sets: recommendations.weeklyWorkingSets.legs },
                          { name: 'Shoulders', sets: recommendations.weeklyWorkingSets.shoulders },
                          { name: 'Arms', sets: recommendations.weeklyWorkingSets.arms },
                        ]}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Working Sets', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Bar dataKey="sets" fill="#6366F1" />
                      </ReBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                  <h4 className="text-sm font-medium text-gray-500">Plan Details</h4>
                  <dl className="mt-2 divide-y divide-gray-200">
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm text-gray-600">Plan Type</dt>
                      <dd className="text-sm font-medium text-gray-900">{recommendations.trainingPlan.type}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm text-gray-600">Focus Area</dt>
                      <dd className="text-sm font-medium text-gray-900">{recommendations.trainingPlan.focusArea}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm text-gray-600">Days Per Week</dt>
                      <dd className="text-sm font-medium text-gray-900">{recommendations.trainingPlan.daysPerWeek}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm text-gray-600">Ideal For</dt>
                      <dd className="text-sm font-medium text-gray-900">{recommendations.trainingPlan.idealFor}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Progress & Adjustments Tab */}
      {activeTab === 'progress' && (
        <div className="mt-6">
          {/* Progress Chart Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <BarChart className="mr-2 h-5 w-5 text-indigo-500" />
                Progress Tracking
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Track your progress over time and see projections to your goal
              </p>
            </div>
            
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getProgressChartData()}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" orientation="left" stroke="#6366F1" />
                    <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
                    <Tooltip />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="weight" 
                      name="Weight (lbs)" 
                      stroke="#6366F1" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="bodyFat" 
                      name="Body Fat (%)" 
                      stroke="#10B981" 
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                      dot={{ strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              <div className="mt-4 flex items-center justify-center">
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800 mr-2">
                  Historical
                </span>
                <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                  Projected
                </span>
              </div>
            </div>
          </div>
          
          {/* Measurements Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <Ruler className="mr-2 h-5 w-5 text-indigo-500" />
                  Measurement History
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your recorded measurements over time
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Save className="mr-2 h-4 w-4" />
                Add New Measurement
              </button>
            </div>
            
            <div className="border-t border-gray-200">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Weight (lbs)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Body Fat (%)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Chest (in)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Waist (in)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Arms (in)
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Shoulders (in)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sampleMeasurementHistory.map((measurement, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {formatDate(measurement.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.weight}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.bodyFat}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.chest}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.waist}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.arms}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {measurement.shoulders}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Plan Adjustments Card */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <RefreshCw className="mr-2 h-5 w-5 text-indigo-500" />
                  Plan Adjustments
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Modifications to your plan based on progress
                </p>
              </div>
              <button
                type="button"
                onClick={adjustPlan}
                disabled={isAdjustingPlan}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isAdjustingPlan ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Adjust Plan
                  </>
                )}
              </button>
            </div>
            
            <div className="border-t border-gray-200">
              {recommendations.adjustments.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {recommendations.adjustments.map((adjustment, index) => (
                    <li key={index} className="px-4 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                              <Flame className="h-5 w-5 text-indigo-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{adjustment.change}</p>
                            <p className="text-sm text-gray-500">{adjustment.reason}</p>
                          </div>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {formatDate(adjustment.date)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-5 sm:px-6 text-center">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100">
                    <Award className="h-6 w-6 text-indigo-600" />
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No adjustments yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Your plan is on track. We'll suggest adjustments when needed based on your progress.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AITrainingPlan;