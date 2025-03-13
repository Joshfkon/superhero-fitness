const Profile = require('../models/Profile');

// @desc    Get user profile
// @route   GET /api/profiles/me
// @access  Private
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.userId });
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Calculate ideal measurements if wrist size is provided
    let idealMeasurements = null;
    if (profile.wristSize) {
      idealMeasurements = profile.calculateIdealMeasurements();
    }
    
    // Return profile with ideal measurements
    res.json({
      profile,
      idealMeasurements
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create or update user profile
// @route   POST /api/profiles/me
// @access  Private
const createOrUpdateProfile = async (req, res) => {
  try {
    const {
      age,
      gender,
      height,
      weight,
      wristSize,
      measurements,
      targetMeasurements, // Added targetMeasurements
      experienceLevel,
      workoutsPerWeek,
      bodyFatGoal,
      goals,
      notes
    } = req.body;
    
    // Build profile object
    const profileFields = {
      user: req.userId,
      age,
      gender,
      height,
      weight,
      wristSize,
      measurements,
      targetMeasurements, // Added targetMeasurements
      experienceLevel,
      workoutsPerWeek,
      bodyFatGoal,
      goals,
      notes
    };
    
    // Find and update profile, create if doesn't exist
    let profile = await Profile.findOne({ user: req.userId });
    
    if (profile) {
      // Update
      profile = await Profile.findOneAndUpdate(
        { user: req.userId },
        { $set: profileFields },
        { new: true }
      );
    } else {
      // Create
      profile = new Profile(profileFields);
      await profile.save();
    }
    
    // Calculate ideal measurements if wrist size is provided
    let idealMeasurements = null;
    if (profile.wristSize) {
      idealMeasurements = profile.calculateIdealMeasurements();
    }
    
    res.json({
      profile,
      idealMeasurements
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getProfile,
  createOrUpdateProfile
};