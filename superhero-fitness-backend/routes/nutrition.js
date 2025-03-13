const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Nutrition = require('../models/Nutrition');

// @route   GET /api/nutrition
// @desc    Get all nutrition entries for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const nutrition = await Nutrition.find({ user: req.userId }).sort({ date: -1 });
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/nutrition/date/:date
// @desc    Get nutrition entries for a specific date
// @access  Private
router.get('/date/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const nutrition = await Nutrition.findOne({ 
      user: req.userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    if (!nutrition) {
      return res.status(404).json({ message: 'No nutrition entries found for this date' });
    }
    
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/nutrition
// @desc    Create a new nutrition entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { date, meals, calorieGoal, proteinGoal, carbsGoal, fatGoal, waterIntake, notes } = req.body;
    
    // Check if an entry already exists for this date
    const existingEntry = await Nutrition.findOne({
      user: req.userId,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });
    
    if (existingEntry) {
      // Update existing entry
      existingEntry.meals = meals || existingEntry.meals;
      existingEntry.calorieGoal = calorieGoal || existingEntry.calorieGoal;
      existingEntry.proteinGoal = proteinGoal || existingEntry.proteinGoal;
      existingEntry.carbsGoal = carbsGoal || existingEntry.carbsGoal;
      existingEntry.fatGoal = fatGoal || existingEntry.fatGoal;
      existingEntry.waterIntake = waterIntake || existingEntry.waterIntake;
      existingEntry.notes = notes || existingEntry.notes;
      
      const updatedEntry = await existingEntry.save();
      return res.json(updatedEntry);
    }
    
    // Create new entry
    const newNutrition = new Nutrition({
      user: req.userId,
      date,
      meals,
      calorieGoal,
      proteinGoal,
      carbsGoal,
      fatGoal,
      waterIntake,
      notes
    });
    
    const nutrition = await newNutrition.save();
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/nutrition/:id/meal
// @desc    Add a meal to a nutrition entry
// @access  Private
router.post('/:id/meal', auth, async (req, res) => {
  try {
    const nutrition = await Nutrition.findById(req.params.id);
    
    // Check if nutrition entry exists
    if (!nutrition) {
      return res.status(404).json({ message: 'Nutrition entry not found' });
    }
    
    // Check user
    if (nutrition.user.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Add new meal
    nutrition.meals.push(req.body);
    await nutrition.save();
    
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/nutrition/:id
// @desc    Update a nutrition entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let nutrition = await Nutrition.findById(req.params.id);
    
    // Check if nutrition entry exists
    if (!nutrition) {
      return res.status(404).json({ message: 'Nutrition entry not found' });
    }
    
    // Check user
    if (nutrition.user.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update nutrition entry
    nutrition = await Nutrition.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(nutrition);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/nutrition/:id
// @desc    Delete a nutrition entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const nutrition = await Nutrition.findById(req.params.id);
    
    // Check if nutrition entry exists
    if (!nutrition) {
      return res.status(404).json({ message: 'Nutrition entry not found' });
    }
    
    // Check user
    if (nutrition.user.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await nutrition.remove();
    res.json({ message: 'Nutrition entry removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;