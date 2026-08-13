const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a service title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please add a short description'],
  },
  details: {
    type: [String],
    default: [],
  },
  icon: {
    type: String,
    default: 'Truck', // Default icon name
  },
  imageUrl: {
    type: String,
    required: [true, 'Please add an image URL'],
  },
  category: {
    type: String,
    required: [true, 'Please specify service category'],
    enum: ['Logistics', 'Manpower', 'Both'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Service', serviceSchema);
