const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Register new user
const registerUser = async (req, res) => {
  try {
    const { username } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ username });
    
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    user = new User({
      username,
      preferredTheme: req.body.preferredTheme || 'GTA5'
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'chronosecret',
      { expiresIn: '7d' }
    );
    
    return res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        preferredTheme: user.preferredTheme
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { username } = req.body;
    
    // Check if user exists
    const user = await User.findOne({ username });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'chronosecret',
      { expiresIn: '7d' }
    );
    
    return res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        preferredTheme: user.preferredTheme
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find user
    const user = await User.findById(userId).select('-__v');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
}; 