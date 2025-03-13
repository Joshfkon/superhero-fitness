const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Import routes
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profiles');
const workoutRoutes = require('./routes/workouts');
const nutritionRoutes = require('./routes/nutrition');
const biomarkerRoutes = require('./routes/biomarkers');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 8080;

console.log('Setting up CORS...');
// Middleware with detailed CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
console.log('CORS setup complete');

app.use(express.json());

// Add request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request headers:', req.headers);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('Request body:', JSON.stringify(req.body, null, 2));
  }
  next();
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/nutrition', nutritionRoutes);
app.use('/api/biomarkers', biomarkerRoutes);

// Base route with debug info
app.get('/', (req, res) => {
  console.log('Base route accessed');
  res.send('SuperHero Fitness API is running!');
});

// Add test route for CORS debugging
app.get('/api/test', (req, res) => {
  console.log('Test route accessed');
  res.json({ message: 'API connection successful!' });
});

// Enhanced server startup with better error handling
const server = app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on port: ${PORT}`);
    console.log(`Server address: 127.0.0.1:${PORT}`);
    console.log(`Try accessing: http://localhost:${PORT} in your browser`);
  })
  
.on('error', (error) => {
  console.error('Server failed to start:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use. Try another port.`);
  } else if (error.code === 'EACCES') {
    console.error(`Port ${PORT} requires elevated privileges. Try using a port number > 1024.`);
  }
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});