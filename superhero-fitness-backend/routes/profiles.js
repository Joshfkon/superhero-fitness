const express = require('express');
const router = express.Router();
const {
  getProfile,
  createOrUpdateProfile
} = require('../controllers/profileController');
const auth = require('../middleware/auth');

// Get user profile
router.get('/me', auth, getProfile);

// Create or update user profile
router.post('/me', auth, createOrUpdateProfile);

module.exports = router;