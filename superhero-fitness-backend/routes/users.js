const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require('../controllers/userController');
const auth = require('../middleware/auth');

// Register a new user
router.post('/register', registerUser);

// Authenticate user and get token
router.post('/login', loginUser);

// Get user profile
router.get('/profile', auth, getUserProfile);

// Update user profile
router.put('/profile', auth, updateUserProfile);

module.exports = router;