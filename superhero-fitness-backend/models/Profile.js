const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    // Basic Information
    age: {
      type: Number,
      min: 16,
      max: 100,
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other'],
    },
    height: {
      type: Number, // in inches
    },
    weight: {
      type: Number, // in lbs
    },
    wristSize: {
      type: Number, // in inches, used for calculating ideal proportions
    },
    
    // Current Measurements
    measurements: {
      chest: Number, // in inches
      shoulders: Number, // in inches
      biceps: Number, // in inches
      forearms: Number, // in inches
      waist: Number, // in inches
      hips: Number, // in inches
      thighs: Number, // in inches
      calves: Number, // in inches
    },
    
    // Target Measurements
    targetMeasurements: {
      chest: Number, // in inches
      shoulders: Number, // in inches
      biceps: Number, // in inches
      forearms: Number, // in inches
      waist: Number, // in inches
      thighs: Number, // in inches
      calves: Number, // in inches
    },
    
    // Training Experience
    experienceLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    },
    workoutsPerWeek: {
      type: Number,
      min: 1,
      max: 7,
    },
    
    // Body Composition Goal
    bodyFatGoal: {
      type: Number,
      min: 5,
      max: 50, // Increased max to match frontend range (6-45)
    },
    
    // Goals
    goals: [String],
    
    // Notes
    notes: String,
    
    // Date fields
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Calculate ideal measurements based on wrist size
ProfileSchema.methods.calculateIdealMeasurements = function() {
  if (!this.wristSize) return null;
  
  // Classic superhero proportions based on wrist measurement
  return {
    chest: parseFloat((this.wristSize * 6.5).toFixed(1)),
    shoulders: parseFloat((this.wristSize * 7.5).toFixed(1)), // Aligned with frontend (was 7.0)
    biceps: parseFloat((this.wristSize * 2.3).toFixed(1)),
    forearms: parseFloat((this.wristSize * 1.8).toFixed(1)),
    neck: parseFloat((this.wristSize * 2.3).toFixed(1)),
    waist: parseFloat((this.wristSize * 4.5).toFixed(1)),
    thighs: parseFloat((this.wristSize * 3.5).toFixed(1)),
    calves: parseFloat((this.wristSize * 2.3).toFixed(1)),
  };
};

module.exports = mongoose.model('Profile', ProfileSchema);