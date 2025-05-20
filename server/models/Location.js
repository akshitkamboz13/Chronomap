const mongoose = require('mongoose');

const LocationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  theme: {
    type: String,
    enum: ['GTA5', 'RDR2', 'RDR', 'Cyberpunk2077'],
    default: 'GTA5'
  }
});

module.exports = mongoose.model('Location', LocationSchema); 