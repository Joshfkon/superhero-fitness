import React, { useState } from 'react';
import { Apple, PieChart, Plus, Calendar, Search, ChevronRight, Utensils, Coffee, Pizza, Activity, ArrowRight, Dumbbell } from 'lucide-react';
import { PieChart as RPieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Sample meal data
const mealData = [
  {
    id: 1,
    date: '2023-03-12',
    meals: [
      {
        id: 1,
        name: 'Breakfast',
        time: '07:30',
        foods: [
          { id: 1, name: 'Oatmeal with Berries', calories: 320, protein: 12, carbs: 54, fat: 6 },
          { id: 2, name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 8, fat: 5 },
          { id: 3, name: 'Black Coffee', calories: 5, protein: 0, carbs: 1, fat: 0 }
        ]
      },
      {
        id: 2,
        name: 'Lunch',
        time: '12:30',
        foods: [
          { id: 1, name: 'Grilled Chicken Salad', calories: 450, protein: 40, carbs: 25, fat: 18 },
          { id: 2, name: 'Whole Grain Bread', calories: 120, protein: 5, carbs: 22, fat: 2 }
        ]
      },
      {
        id: 3,
        name: 'Snack',
        time: '15:30',
        foods: [
          { id: 1, name: 'Protein Shake', calories: 200, protein: 30, carbs: 5, fat: 4 },
          { id: 2, name: 'Apple', calories: 95, protein: 0, carbs: 25, fat: 0 }
        ]
      },
      {
        id: 4,
        name: 'Dinner',
        time: '19:00',
        foods: [
          { id: 1, name: 'Salmon', calories: 360, protein: 36, carbs: 0, fat: 20 },
          { id: 2, name: 'Brown Rice', calories: 220, protein: 5, carbs: 46, fat: 2 },
          { id: 3, name: 'Steamed Broccoli', calories: 55, protein: 4, carbs: 10, fat: 1 }
        ]
      }
    ]
  }
];

// Sample food database items for quick add
const quickAddFoods = [
  { id: 1, name: 'Chicken Breast (4oz)', calories: 120, protein: 26, carbs: 0, fat: 2 },
  { id: 2, name: 'Brown Rice (1 cup)', calories: 220, protein: 5, carbs: 46, fat: 2 },
  { id: 3, name: 'Sweet Potato (1 medium)', calories: 115, protein: 2, carbs: 27, fat: 0 },
  { id: 4, name: 'Broccoli (1 cup)', calories: 55, protein: 4, carbs: 10, fat: 1 },
  { id: 5, name: 'Salmon (4oz)', calories: 160, protein: 23, carbs: 0, fat: 7 },
  { id: 6, name: 'Egg (1 large)', calories: 70, protein: 6, carbs: 0, fat: 5 },
  { id: 7, name: 'Oatmeal (1 cup)', calories: 158, protein: 6, carbs: 27, fat: 3 },
  { id: 8, name: 'Greek Yogurt (1 cup)', calories: 150, protein: 15, carbs: 8, fat: 5 }
];

// Nutrition targets
const nutritionTargets = {
  calories: 2800,
  protein: 200,
  carbs: 310,
  fat: 85
};

const Nutrition = () => {
  const [activeTab, setActiveTab] = useState('log');
  const [activeDate, setActiveDate] = useState('2023-03-12'); // Today
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  
  // Calculate nutrition totals for the day
  const calculateDailyTotals = () => {
    // Find the meal data for the active date
    const dayData = mealData.find(day => day.date === activeDate);
    
    if (!dayData) return { calories: 0, protein: 0, carbs: 0, fat: 0 };
    
    // Sum up all nutrition values from all meals and foods
    return dayData.meals.reduce((totals, meal) => {
      meal.foods.forEach(food => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fat += food.fat;
      });
      return totals;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
  };
  
  const dailyTotals = calculateDailyTotals();
  
  // Calculate macro ratios as percentages
  const calculateMacroRatios = () => {
    const totalCaloriesFromMacros = 
      (dailyTotals.protein * 4) + 
      (dailyTotals.carbs * 4) + 
      (dailyTotals.fat * 9);
    
    if (totalCaloriesFromMacros === 0) return [{ name: 'No Data', value: 1 }];
    
    return [
      { name: 'Protein', value: Math.round((dailyTotals.protein * 4 / totalCaloriesFromMacros) * 100) },
      { name: 'Carbs', value: Math.round((dailyTotals.carbs * 4 / totalCaloriesFromMacros) * 100) },
      { name: 'Fat', value: Math.round((dailyTotals.fat * 9 / totalCaloriesFromMacros) * 100) }
    ];
  };
  
  const macroRatios = calculateMacroRatios();
  
  // Weekly nutrition data for charts
  const weeklyData = [
    { day: 'Mon', calories: 2650, protein: 195, carbs: 290, fat: 82 },
    { day: 'Tue', calories: 2720, protein: 205, carbs: 301, fat: 79 },
    { day: 'Wed', calories: 2590, protein: 190, carbs: 275, fat: 84 },
    { day: 'Thu', calories: 2810, protein: 210, carbs: 310, fat: 86 },
    { day: 'Fri', calories: 2740, protein: 200, carbs: 295, fat: 88 },
    { day: 'Sat', calories: 2950, protein: 180, carbs: 350, fat: 92 },
    { day: 'Sun', calories: dailyTotals.calories, protein: dailyTotals.protein, carbs: dailyTotals.carbs, fat: dailyTotals.fat }
  ];
  
  // Get meals for the active date
  const getMealsForActiveDate = () => {
    const dayData = mealData.find(day => day.date === activeDate);
    return dayData ? dayData.meals : [];
  };
  
  const meals = getMealsForActiveDate();
  
  // Filter quick add foods based on search query
  const filteredQuickAddFoods = quickAddFoods.filter(food => 
    food.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Nutrition</h1>
      <p className="mt-1 text-sm text-gray-500">
        Track your meals and monitor your nutritional intake
      </p>
      
      {/* Tabs */}
      <div className="mt-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'log'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('log')}
          >
            Food Log
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'analysis'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('analysis')}
          >
            Nutrition Analysis
          </button>
          <button
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'plans'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('plans')}
          >
            Meal Plans
          </button>
        </nav>
      </div>
      
      {/* Food Log Tab */}
      {activeTab === 'log' && (
        <div className="mt-6">
          {/* Date Selector and Add Meal Button */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-2" />
              <select
                id="date-select"
                name="date-select"
                className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={activeDate}
                onChange={(e) => setActiveDate(e.target.value)}
              >
                <option value="2023-03-12">Today (Sun, Mar 12)</option>
                <option value="2023-03-11">Yesterday (Sat, Mar 11)</option>
                <option value="2023-03-10">Friday (Mar 10)</option>
                <option value="2023-03-09">Thursday (Mar 9)</option>
              </select>
            </div>
            
            <button
              type="button"
              onClick={() => setShowAddMealModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Food
            </button>
          </div>
          
          {/* Daily Summary */}
          <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Daily Summary</h3>
              
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-4">
                {/* Calories */}
                <div className="bg-indigo-50 rounded-lg px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <Activity className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Calories</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {dailyTotals.calories} / {nutritionTargets.calories}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div
                        className="absolute h-2 bg-indigo-600 rounded-full"
                        style={{ width: `${Math.min(100, (dailyTotals.calories / nutritionTargets.calories) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Protein */}
                <div className="bg-blue-50 rounded-lg px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                      <span className="h-6 w-6 text-blue-600 font-bold">P</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Protein</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {dailyTotals.protein}g / {nutritionTargets.protein}g
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div
                        className="absolute h-2 bg-blue-600 rounded-full"
                        style={{ width: `${Math.min(100, (dailyTotals.protein / nutritionTargets.protein) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Carbs */}
                <div className="bg-green-50 rounded-lg px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                      <span className="h-6 w-6 text-green-600 font-bold">C</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Carbs</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {dailyTotals.carbs}g / {nutritionTargets.carbs}g
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div
                        className="absolute h-2 bg-green-600 rounded-full"
                        style={{ width: `${Math.min(100, (dailyTotals.carbs / nutritionTargets.carbs) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Fat */}
                <div className="bg-yellow-50 rounded-lg px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
                      <span className="h-6 w-6 text-yellow-600 font-bold">F</span>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Fat</dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900">
                            {dailyTotals.fat}g / {nutritionTargets.fat}g
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="relative h-2 bg-gray-200 rounded-full">
                      <div
                        className="absolute h-2 bg-yellow-600 rounded-full"
                        style={{ width: `${Math.min(100, (dailyTotals.fat / nutritionTargets.fat) * 100)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Macro Ratio</h4>
                <div className="flex items-center">
                  <div className="w-20 h-20">
                    <ResponsiveContainer width="100%" height="100%">
                      <RPieChart>
                        <Pie
                          data={macroRatios}
                          cx="50%"
                          cy="50%"
                          innerRadius={15}
                          outerRadius={35}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          <Cell fill="#3B82F6" /> {/* Protein */}
                          <Cell fill="#10B981" /> {/* Carbs */}
                          <Cell fill="#F59E0B" /> {/* Fat */}
                        </Pie>
                      </RPieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Protein: {macroRatios[0]?.value || 0}%</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Carbs: {macroRatios[1]?.value || 0}%</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Fat: {macroRatios[2]?.value || 0}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Meals List */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Today's Meals</h3>
              <button
                type="button"
                onClick={() => setShowAddMealModal(true)}
                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Meal
              </button>
            </div>
            <div className="border-t border-gray-200">
              <div className="divide-y divide-gray-200">
                {meals.map((meal) => (
                  <div key={meal.id} className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        {meal.name === 'Breakfast' && <Coffee className="h-5 w-5 text-amber-500 mr-2" />}
                        {meal.name === 'Lunch' && <Utensils className="h-5 w-5 text-green-500 mr-2" />}
                        {meal.name === 'Dinner' && <Utensils className="h-5 w-5 text-indigo-500 mr-2" />}
                        {meal.name === 'Snack' && <Apple className="h-5 w-5 text-red-500 mr-2" />}
                        <h4 className="text-md font-medium text-gray-900">{meal.name}</h4>
                      </div>
                      <div className="text-sm text-gray-500">{meal.time}</div>
                    </div>
                    <div className="mt-3 space-y-2">
                      {meal.foods.map((food) => (
                        <div key={food.id} className="flex justify-between items-center border-b border-gray-100 pb-2">
                          <div className="text-sm text-gray-900">{food.name}</div>
                          <div className="text-sm text-gray-500">
                            {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowAddMealModal(true)}
                        className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
                      >
                        + Add food to this meal
                      </button>
                    </div>
                  </div>
                ))}
                
                {meals.length === 0 && (
                  <div className="px-4 py-12 text-center">
                    <Apple className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No meals logged</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Start logging your meals to track your nutrition.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        onClick={() => setShowAddMealModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add First Meal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Quick Add Food Modal */}
          {showAddMealModal && (
            <div className="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setShowAddMealModal(false)}></div>
                
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                          Add Food
                        </h3>
                        <div className="mt-4">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                              type="text"
                              name="search"
                              id="search"
                              className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Search foods..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                            />
                          </div>
                          
                          <div className="mt-3">
                            <label className="block text-sm font-medium text-gray-700">
                              Meal
                            </label>
                            <select
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            >
                              <option>Breakfast</option>
                              <option>Lunch</option>
                              <option>Dinner</option>
                              <option>Snack</option>
                              <option>+ Add New Meal</option>
                            </select>
                          </div>
                          
                          <div className="mt-4">
                            <h4 className="text-sm font-medium text-gray-700">Quick Add Foods</h4>
                            <div className="mt-2 max-h-60 overflow-y-auto">
                              <ul className="divide-y divide-gray-200">
                                {filteredQuickAddFoods.map((food) => (
                                  <li key={food.id} className="py-3 flex justify-between">
                                    <div className="flex items-center">
                                      <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{food.name}</p>
                                        <p className="text-sm text-gray-500">
                                          {food.calories} cal | P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                                        </p>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                      Add
                                    </button>
                                  </li>
                                ))}
                                
                                {filteredQuickAddFoods.length === 0 && (
                                  <li className="py-4 text-center text-sm text-gray-500">
                                    No matching foods found
                                  </li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Custom Food
                    </button>
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={() => setShowAddMealModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Nutrition Analysis Tab */}
      {activeTab === 'analysis' && (
        <div className="mt-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex items-center">
              <PieChart className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="text-lg leading-6 font-medium text-gray-900">Weekly Nutrition Overview</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weeklyData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="calories" name="Calories (÷10)" fill="#6366F1" />
                    <Bar dataKey="protein" name="Protein (g)" fill="#3B82F6" />
                    <Bar dataKey="carbs" name="Carbs (g)" fill="#10B981" />
                    <Bar dataKey="fat" name="Fat (g)" fill="#F59E0B" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Protein Sources</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Top sources of protein in your diet
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-xs mr-2">1</span>
                      <p className="text-sm font-medium text-gray-900">Chicken Breast</p>
                    </div>
                    <p className="text-sm text-gray-500">76g (38%)</p>
                  </li>
                  <li className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-xs mr-2">2</span>
                      <p className="text-sm font-medium text-gray-900">Protein Shake</p>
                    </div>
                    <p className="text-sm text-gray-500">60g (30%)</p>
                  </li>
                  <li className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-xs mr-2">3</span>
                      <p className="text-sm font-medium text-gray-900">Greek Yogurt</p>
                    </div>
                    <p className="text-sm text-gray-500">30g (15%)</p>
                  </li>
                  <li className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-xs mr-2">4</span>
                      <p className="text-sm font-medium text-gray-900">Salmon</p>
                    </div>
                    <p className="text-sm text-gray-500">23g (11.5%)</p>
                  </li>
                  <li className="py-3 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded-full text-xs mr-2">5</span>
                      <p className="text-sm font-medium text-gray-900">Eggs</p>
                    </div>
                    <p className="text-sm text-gray-500">12g (6%)</p>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Nutrition Insights</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  AI-driven nutritional analysis
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="h-5 w-5 text-yellow-400">⚠️</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-yellow-800">Low Fiber Intake</h3>
                        <div className="mt-2 text-sm text-yellow-700">
                          <p>
                            Your fiber intake is averaging 22g per day, which is below the recommended 30g. Consider adding more fruits, vegetables, and whole grains.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="h-5 w-5 text-green-400">✅</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-green-800">Excellent Protein Distribution</h3>
                        <div className="mt-2 text-sm text-green-700">
                          <p>
                            You're consuming protein consistently throughout the day, which is optimal for muscle protein synthesis.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <span className="h-5 w-5 text-blue-400">💡</span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-800">Hydration Reminder</h3>
                        <div className="mt-2 text-sm text-blue-700">
                          <p>
                            Based on your activity level and protein intake, aim for at least 3-4 liters of water daily to support recovery and metabolism.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Meal Plans Tab */}
      {activeTab === 'plans' && (
        <div className="mt-6">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900">Meal Plans</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Suggested meal plans based on your goals
                </p>
              </div>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Plan
              </button>
            </div>
            <div className="border-t border-gray-200">
              <ul className="divide-y divide-gray-200">
                <li>
                  <a href="#" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                            <Dumbbell className="h-5 w-5 text-indigo-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-indigo-600">Muscle Building Plan</div>
                            <div className="text-sm text-gray-500">High protein, moderate carbs, 3,000 calories</div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <Activity className="h-5 w-5 text-green-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-green-600">Cutting Plan</div>
                            <div className="text-sm text-gray-500">High protein, low carb, 2,200 calories</div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="#" className="block hover:bg-gray-50">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Pizza className="h-5 w-5 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-blue-600">Maintenance Plan</div>
                            <div className="text-sm text-gray-500">Balanced macros, 2,800 calories</div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0 flex">
                          <ChevronRight className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-gradient-to-r from-indigo-800 to-indigo-600 rounded-lg shadow-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="sm:flex sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-white">Get a Personalized Nutrition Plan</h3>
                  <div className="mt-2 max-w-xl text-sm text-indigo-100">
                    <p>
                      Our AI can analyze your workout data, current measurements, and goals to create a
                      customized nutrition plan designed specifically for your superhero physique journey.
                    </p>
                  </div>
                </div>
                <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0 sm:flex sm:items-center">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                  >
                    Generate Plan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Nutrition;