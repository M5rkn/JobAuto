const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  price: { type: Number, required: true },
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available',
  },
  vin: { type: String, required: true, unique: true },
  imageUrl: { type: String },
}, {
  timestamps: true
});

module.exports = mongoose.model('Car', carSchema); 