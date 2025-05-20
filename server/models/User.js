const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  preferredTheme: {
    type: String,
    enum: ['GTA5', 'RDR2', 'RDR', 'Cyberpunk2077'],
    default: 'GTA5'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema); 