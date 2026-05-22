const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['2pm', '9pm'],
    required: true,
    unique: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Image', imageSchema);