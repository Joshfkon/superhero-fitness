const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Biomarker = require('../models/Biomarker');

// @route   GET /api/biomarkers
// @desc    Get all biomarker entries for a user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const biomarkers = await Biomarker.find({ user: req.userId }).sort({ date: -1 });
    res.json(biomarkers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/biomarkers/latest
// @desc    Get the latest biomarker entry for a user
// @access  Private
router.get('/latest', auth, async (req, res) => {
  try {
    const biomarker = await Biomarker.findOne({ user: req.userId }).sort({ date: -1 });
    
    if (!biomarker) {
      return res.status(404).json({ message: 'No biomarker entries found' });
    }
    
    res.json(biomarker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/biomarkers/date/:date
// @desc    Get biomarker entry for a specific date
// @access  Private
router.get('/date/:date', auth, async (req, res) => {
  try {
    const date = new Date(req.params.date);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const biomarker = await Biomarker.findOne({ 
      user: req.userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });
    
    if (!biomarker) {
      return res.status(404).json({ message: 'No biomarker entry found for this date' });
    }
    
    res.json(biomarker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   GET /api/biomarkers/type/:type
// @desc    Get biomarker entries filtered by type (sleep, mood, vitals, etc.)
// @access  Private
router.get('/type/:type', auth, async (req, res) => {
  try {
    const { type } = req.params;
    const validTypes = ['sleep', 'mood', 'vitals', 'strength', 'bloodwork', 'recovery'];
    
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: 'Invalid biomarker type' });
    }
    
    // Use MongoDB projection to only return the specified type
    const projection = {};
    projection[type] = 1;
    projection.date = 1;
    
    const biomarkers = await Biomarker.find(
      { 
        user: req.userId,
        // Only return documents where the specified type exists
        [`${type}.hours`]: { $exists: true }
      },
      projection
    ).sort({ date: -1 });
    
    res.json(biomarkers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   POST /api/biomarkers
// @desc    Create a new biomarker entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { date, sleep, mood, vitals, strength, bloodwork, recovery, notes } = req.body;
    
    // Check if an entry already exists for this date
    const existingEntry = await Biomarker.findOne({
      user: req.userId,
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });
    
    if (existingEntry) {
      // Update existing entry with provided fields
      if (sleep) existingEntry.sleep = { ...existingEntry.sleep, ...sleep };
      if (mood) existingEntry.mood = { ...existingEntry.mood, ...mood };
      if (vitals) existingEntry.vitals = { ...existingEntry.vitals, ...vitals };
      if (strength) existingEntry.strength = { ...existingEntry.strength, ...strength };
      if (bloodwork) existingEntry.bloodwork = { ...existingEntry.bloodwork, ...bloodwork };
      if (recovery) existingEntry.recovery = { ...existingEntry.recovery, ...recovery };
      if (notes) existingEntry.notes = notes;
      
      const updatedEntry = await existingEntry.save();
      return res.json(updatedEntry);
    }
    
    // Create new entry
    const newBiomarker = new Biomarker({
      user: req.userId,
      date: date || Date.now(),
      sleep,
      mood,
      vitals,
      strength,
      bloodwork,
      recovery,
      notes
    });
    
    const biomarker = await newBiomarker.save();
    res.json(biomarker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   PUT /api/biomarkers/:id
// @desc    Update a biomarker entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    let biomarker = await Biomarker.findById(req.params.id);
    
    // Check if biomarker entry exists
    if (!biomarker) {
      return res.status(404).json({ message: 'Biomarker entry not found' });
    }
    
    // Check user
    if (biomarker.user.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    // Update biomarker entry
    biomarker = await Biomarker.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    
    res.json(biomarker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

// @route   DELETE /api/biomarkers/:id
// @desc    Delete a biomarker entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const biomarker = await Biomarker.findById(req.params.id);
    
    // Check if biomarker entry exists
    if (!biomarker) {
      return res.status(404).json({ message: 'Biomarker entry not found' });
    }
    
    // Check user
    if (biomarker.user.toString() !== req.userId.toString()) {
      return res.status(401).json({ message: 'User not authorized' });
    }
    
    await biomarker.remove();
    res.json({ message: 'Biomarker entry removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;