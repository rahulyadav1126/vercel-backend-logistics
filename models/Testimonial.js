const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  clientName: {
    type: String,
    required: [true, 'Please add a client name'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please add a company name'],
    trim: true,
  },
  feedback: {
    type: String,
    required: [true, 'Please add feedback content'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 5,
  },
  avatar: {
    type: String,
    default: '', // Default avatar image path
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Testimonial', testimonialSchema);
