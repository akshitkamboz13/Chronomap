const express = require('express');
const router = express.Router();

// Import user controller (to be created)
const { 
  registerUser, 
  loginUser, 
  getUserProfile 
} = require('../controllers/userController');

// Routes
// POST register new user
router.post('/register', registerUser);

// POST user login
router.post('/login', loginUser);

// GET user profile
router.get('/profile/:userId', getUserProfile);

module.exports = router; 