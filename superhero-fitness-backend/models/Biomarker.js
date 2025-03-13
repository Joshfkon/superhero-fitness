const mongoose = require('mongoose');

// Main biomarker schema
const BiomarkerSchema = new mongoose.Schema(
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
    // Sleep metrics
    sleep: {
      hours: Number,
      quality: Number, // 1-10 scale
      deepSleep: Number, // hours
      remSleep: Number, // hours
      notes: String
    },
    // Mood and energy metrics
    mood: {
      overall: Number, // 1-10 scale
      energy: Number, // 1-10 scale
      stress: Number, // 1-10 scale
      notes: String
    },
    // Heart and cardiovascular metrics
    vitals: {
      restingHeartRate: Number, // bpm
      bloodPressure: {
        systolic: Number,
        diastolic: Number
      },
      heartRateVariability: Number, // ms
      notes: String
    },
    // Strength metrics
    strength: {
      gripStrength: Number, // kg
      legExtension: Number, // kg
      benchPress: Number, // lbs or kg
      notes: String
    },
    // Bloodwork results
    bloodwork: {
      testosterone: Number, // ng/dL
      cortisol: Number, // μg/dL
      vitaminD: Number, // ng/mL
      glucose: Number, // mg/dL
      dateCollected: Date,
      notes: String
    },
    // Recovery score
    recovery: {
      overallScore: Number, // 0-100
      muscleReadiness: Number, // 1-10
      energyLevel: Number, // 1-10
      sleepQuality: Number, // 1-10
      notes: String
    },
    // General notes
    notes: String
  },
  { timestamps: true }
);

// Calculate overall recovery score if not provided
BiomarkerSchema.pre('save', function(next) {
  // If recovery score is not provided but components are, calculate it
  if (!this.recovery.overallScore && 
      this.recovery.muscleReadiness && 
      this.recovery.energyLevel && 
      this.recovery.sleepQuality) {
    
    // Simple weighted average formula
    const muscleWeight = 0.35;
    const energyWeight = 0.3;
    const sleepWeight = 0.35;
    
    const overallScore = Math.round(
      (this.recovery.muscleReadiness * muscleWeight * 10) +
      (this.recovery.energyLevel * energyWeight * 10) +
      (this.recovery.sleepQuality * sleepWeight * 10)
    );
    
    this.recovery.overallScore = overallScore;
  }
  
  next();
});

module.exports = mongoose.model('Biomarker', BiomarkerSchema);