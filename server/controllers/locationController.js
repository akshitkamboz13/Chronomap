const Location = require('../models/Location');
const Pin = require('../models/Pin');
const SharedLocation = require('../models/SharedLocation');

// Get user's location history
const getUserLocations = async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeFilter } = req.query;
    
    let timeQuery = {};
    
    // Handle time filtering
    if (timeFilter) {
      const now = new Date();
      let startTime = new Date();
      
      switch (timeFilter) {
        case 'today':
          startTime.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          startTime.setDate(startTime.getDate() - 1);
          startTime.setHours(0, 0, 0, 0);
          const endOfYesterday = new Date(startTime);
          endOfYesterday.setHours(23, 59, 59, 999);
          timeQuery = { timestamp: { $gte: startTime, $lte: endOfYesterday } };
          break;
        case 'week':
          startTime.setDate(startTime.getDate() - 7);
          break;
        default:
          // No filter, get all data
          break;
      }
      
      if (timeFilter !== 'yesterday') {
        timeQuery = { timestamp: { $gte: startTime } };
      }
    }
    
    // Find locations with userId and time filter
    const locations = await Location.find({
      userId,
      ...timeQuery
    }).sort({ timestamp: 1 });
    
    return res.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Create new location
const createLocation = async (req, res) => {
  try {
    const { lat, lng, timestamp, theme, userId } = req.body;
    
    // Create new location
    const location = new Location({
      userId,
      lat,
      lng,
      timestamp: timestamp || Date.now(),
      theme
    });
    
    await location.save();
    
    return res.status(201).json(location);
  } catch (error) {
    console.error('Error creating location:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Create new pin/note
const createPin = async (req, res) => {
  try {
    const { lat, lng, note, timestamp, theme, userId } = req.body;
    
    // Create new pin
    const pin = new Pin({
      userId,
      lat,
      lng,
      note,
      timestamp: timestamp || Date.now(),
      theme
    });
    
    await pin.save();
    
    return res.status(201).json(pin);
  } catch (error) {
    console.error('Error creating pin:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Get user's pins/notes
const getPins = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find pins with userId
    const pins = await Pin.find({ userId }).sort({ timestamp: -1 });
    
    return res.json(pins);
  } catch (error) {
    console.error('Error fetching pins:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Delete user's location history
const deleteLocation = async (req, res) => {
  try {
    const { userId } = req.params;
    const { timeFilter } = req.query;
    
    let timeQuery = {};
    
    // Handle time filtering for deletion
    if (timeFilter) {
      const now = new Date();
      let startTime = new Date();
      
      switch (timeFilter) {
        case 'today':
          startTime.setHours(0, 0, 0, 0);
          break;
        case 'yesterday':
          startTime.setDate(startTime.getDate() - 1);
          startTime.setHours(0, 0, 0, 0);
          const endOfYesterday = new Date(startTime);
          endOfYesterday.setHours(23, 59, 59, 999);
          timeQuery = { timestamp: { $gte: startTime, $lte: endOfYesterday } };
          break;
        case 'week':
          startTime.setDate(startTime.getDate() - 7);
          break;
        default:
          // Delete all if no filter specified
          break;
      }
      
      if (timeFilter !== 'yesterday') {
        timeQuery = { timestamp: { $gte: startTime } };
      }
    }
    
    // Delete locations with userId and time filter
    const result = await Location.deleteMany({
      userId,
      ...timeQuery
    });
    
    return res.json({ message: `${result.deletedCount} locations deleted` });
  } catch (error) {
    console.error('Error deleting locations:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Save a shared location
const saveSharedLocation = async (req, res) => {
  try {
    const { userId, sharedByUserId, lat, lng, name, theme } = req.body;
    
    // Create new shared location
    const sharedLocation = new SharedLocation({
      userId,
      sharedByUserId,
      lat,
      lng,
      name: name || 'Shared Location',
      timestamp: Date.now(),
      theme
    });
    
    await sharedLocation.save();
    
    return res.status(201).json(sharedLocation);
  } catch (error) {
    console.error('Error saving shared location:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

// Get user's saved shared locations
const getSharedLocations = async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Find shared locations for this user
    const sharedLocations = await SharedLocation.find({ userId }).sort({ timestamp: -1 });
    
    return res.json(sharedLocations);
  } catch (error) {
    console.error('Error fetching shared locations:', error);
    return res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getUserLocations,
  createLocation,
  createPin,
  getPins,
  deleteLocation,
  saveSharedLocation,
  getSharedLocations
}; 