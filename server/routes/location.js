const express = require('express');
const router = express.Router();

// Import location controller (to be created)
const { 
  getUserLocations, 
  createLocation, 
  createPin, 
  getPins, 
  deleteLocation,
  saveSharedLocation,
  getSharedLocations
} = require('../controllers/locationController');

// Routes
// GET user's location history
router.get('/:userId', getUserLocations);

// POST new location
router.post('/', createLocation);

// POST new pin/note
router.post('/pin', createPin);

// GET user's pins/notes
router.get('/pin/:userId', getPins);

// DELETE user's location history
router.delete('/:userId', deleteLocation);

// POST save shared location
router.post('/shared', saveSharedLocation);

// GET user's saved shared locations
router.get('/shared/:userId', getSharedLocations);

module.exports = router; 