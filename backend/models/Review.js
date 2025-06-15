const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Car'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema); 