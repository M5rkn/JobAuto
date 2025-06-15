const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
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
    brand: { type: String, required: true },
    model: { type: String, required: true },
    year: { type: Number, required: true },
  },
  priceAtOrder: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  comment: { type: String },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Order', orderSchema); 