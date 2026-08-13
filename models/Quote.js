const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phone: {
    type: String,
    required: [true, 'Please add a contact phone number'],
  },
  serviceType: {
    type: String,
    required: [true, 'Please specify the service type needed'],
  },
  companySize: {
    type: String,
    default: '',
  },
  pickupLocation: {
    type: String,
    default: '',
  },
  deliveryLocation: {
    type: String,
    default: '',
  },
  message: {
    type: String,
    required: [true, 'Please add details about your request'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Replied'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Quote', quoteSchema);
