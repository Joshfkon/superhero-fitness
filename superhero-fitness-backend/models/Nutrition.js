const mongoose = require('mongoose');

// Food item schema
const FoodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  calories: {
    type: Number,
    default: 0
  },
  protein: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    default: 0
  },
  fat: {
    type: Number,
    default: 0
  },
  fiber: {
    type: Number,
    default: 0
  },
  sugar: {
    type: Number,
    default: 0
  },
  servingSize: {
    type: String
  },
  quantity: {
    type: Number,
    default: 1
  }
});

// Meal schema
const MealSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  time: {
    type: String
  },
  foods: [FoodItemSchema],
  notes: String
});

// Main nutrition schema
const NutritionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    meals: [MealSchema],
    // Totals for the day
    totalCalories: {
      type: Number,
      default: 0
    },
    totalProtein: {
      type: Number,
      default: 0
    },
    totalCarbs: {
      type: Number,
      default: 0
    },
    totalFat: {
      type: Number,
      default: 0
    },
    totalFiber: {
      type: Number,
      default: 0
    },
    totalSugar: {
      type: Number,
      default: 0
    },
    // User's daily goals
    calorieGoal: {
      type: Number
    },
    proteinGoal: {
      type: Number
    },
    carbsGoal: {
      type: Number
    },
    fatGoal: {
      type: Number
    },
    // Additional notes
    notes: String,
    // Water intake in ounces
    waterIntake: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Calculate totals before saving
NutritionSchema.pre('save', function(next) {
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalSugar = 0;
  
  this.meals.forEach(meal => {
    meal.foods.forEach(food => {
      const multiplier = food.quantity || 1;
      totalCalories += (food.calories * multiplier);
      totalProtein += (food.protein * multiplier);
      totalCarbs += (food.carbs * multiplier);
      totalFat += (food.fat * multiplier);
      totalFiber += (food.fiber * multiplier || 0);
      totalSugar += (food.sugar * multiplier || 0);
    });
  });
  
  this.totalCalories = totalCalories;
  this.totalProtein = totalProtein;
  this.totalCarbs = totalCarbs;
  this.totalFat = totalFat;
  this.totalFiber = totalFiber;
  this.totalSugar = totalSugar;
  
  next();
});

module.exports = mongoose.model('Nutrition', NutritionSchema);