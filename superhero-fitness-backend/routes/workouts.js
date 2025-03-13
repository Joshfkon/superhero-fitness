const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Workout = require('../models/Workout');

// @route   GET /api/workouts
// @desc    Get all workouts for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.userId }).sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/workouts
// @desc    Create a new workout
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const newWorkout = new Workout({
      user: req.userId,
      ...req.body
    });
    
    const workout = await newWorkout.save();
    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/workouts/:id
// @desc    Get workout by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check user
    if (workout.user.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/workouts/:id
// @desc    Update a workout
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let workout = await Workout.findById(req.params.id);
    
    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check user
    if (workout.user.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update workout
    workout = await Workout.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/workouts/:id
// @desc    Delete a workout
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    // Check if workout exists
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Check user
    if (workout.user.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await workout.remove();
    res.json({ message: 'Workout removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;