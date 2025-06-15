const mongoose = require('mongoose');

const testDriveSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  carDetails: {
    brand: String,
    model: String,
  },
  requestedDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Declined', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  notes: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('TestDrive', testDriveSchema); 