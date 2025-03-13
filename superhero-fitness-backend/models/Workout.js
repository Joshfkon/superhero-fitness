const mongoose = require('mongoose');

// Define the set schema
const SetSchema = new mongoose.Schema({
  weight: {
    type: Number,
    default: 0
  },
  reps: {
    type: Number,
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  }
});

// Define the exercise schema
const ExerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  sets: [SetSchema],
  rest: {
    type: String,
    default: '60 sec'
  },
  notes: String
});

// Define workout schema
const WorkoutSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['Strength', 'Hypertrophy', 'Endurance', 'HIIT', 'Cardio', 'Recovery', 'Other'],
      default: 'Strength'
    },
    difficulty: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'],
      default: 'Intermediate'
    },
    date: {
      type: Date,
      default: Date.now
    },
    startTime: Date,
    endTime: Date,
    duration: Number, // in minutes
    exercises: [ExerciseSchema],
    status: {
      type: String,
      enum: ['planned', 'in_progress', 'completed', 'skipped'],
      default: 'planned'
    },
    notes: String,
    // For tracking overall metrics
    totalWeight: {
      type: Number,
      default: 0
    },
    totalReps: {
      type: Number,
      default: 0
    },
    totalSets: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// Is this a template or a regular workout?
WorkoutSchema.virtual('isTemplate').get(function() {
  return !this.date;
});

// Calculate total weight, reps, and sets before saving
WorkoutSchema.pre('save', function(next) {
  let totalWeight = 0;
  let totalReps = 0;
  let totalSets = 0;
  
  this.exercises.forEach(exercise => {
    exercise.sets.forEach(set => {
      if (set.completed) {
        totalWeight += (set.weight * set.reps);
        totalReps += set.reps;
        totalSets += 1;
      }
    });
  });
  
  this.totalWeight = totalWeight;
  this.totalReps = totalReps;
  this.totalSets = totalSets;
  
  next();
});

module.exports = mongoose.model('Workout', WorkoutSchema);