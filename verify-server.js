// Server Verification Script
// This script loads all backend routes and models to ensure they have no syntax errors and resolve correctly.

const express = require('express');
const mongoose = require('mongoose');

console.log('==================================================');
console.log('STARTING BACKEND COMPILE VERIFICATION TEST');
console.log('==================================================');

try {
  console.log('1. Checking model loads...');
  const User = require('./models/User');
  const Service = require('./models/Service');
  const Gallery = require('./models/Gallery');
  const Testimonial = require('./models/Testimonial');
  const Contact = require('./models/Contact');
  const Quote = require('./models/Quote');
  const Career = require('./models/Career');
  const Application = require('./models/Application');
  console.log('✔ Models loaded successfully.');

  console.log('2. Checking controller loads...');
  const authController = require('./controllers/authController');
  const serviceController = require('./controllers/serviceController');
  const galleryController = require('./controllers/galleryController');
  const testimonialController = require('./controllers/testimonialController');
  const contactController = require('./controllers/contactController');
  const quoteController = require('./controllers/quoteController');
  const careerController = require('./controllers/careerController');
  console.log('✔ Controllers loaded successfully.');

  console.log('3. Initializing mock Express application for routing audit...');
  const app = express();
  app.use(express.json());

  console.log('4. Registering backend routes...');
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/services', require('./routes/serviceRoutes'));
  app.use('/api/gallery', require('./routes/galleryRoutes'));
  app.use('/api/testimonials', require('./routes/testimonialRoutes'));
  app.use('/api/contacts', require('./routes/contactRoutes'));
  app.use('/api/quotes', require('./routes/quoteRoutes'));
  app.use('/api/careers', require('./routes/careerRoutes'));
  app.use('/api/upload', require('./routes/uploadRoutes'));
  console.log('✔ Routing trees registered successfully.');

  console.log('==================================================');
  console.log('✔ VERIFICATION SUCCESS: All backend files compiled!');
  console.log('==================================================');
  process.exit(0);
} catch (error) {
  console.error('❌ VERIFICATION FAILURE: Exception thrown during compile audit:');
  console.error(error.stack);
  process.exit(1);
}
