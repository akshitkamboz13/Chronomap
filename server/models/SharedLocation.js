const mongoose = require('mongoose');

const SharedLocationSchema = new mongoose.Schema({
  // The user who saved this shared location
  userId: {
    type: String,
    required: true,
    index: true
  },
  // The user who originally shared the location (optional)
  sharedByUserId: {
    type: String,
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
  name: {
    type: String,
    default: 'Shared Location'
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

module.exports = mongoose.model('SharedLocation', SharedLocationSchema); 