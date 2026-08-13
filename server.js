// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const path = require('path');
// const connectDB = require('./config/db');

// // Load environment variables
// dotenv.config();

// // Connect to Database
// connectDB();

// const app = express();

// // Body Parser Middleware
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Enable CORS
// const allowedOrigins = process.env.CLIENT_URL
//   ? process.env.CLIENT_URL.split(',').map(origin => origin.trim())
//   : ['http://localhost:3000', 'http://localhost:5173'];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin) return callback(null, true);
//     if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
//       return callback(null, true);
//     }
//     return callback(new Error('Not allowed by CORS'), false);
//   },
//   credentials: true,
// }));

// // Serve uploads folder as static
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // Routes files
// const authRoutes = require('./routes/authRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');
// const galleryRoutes = require('./routes/galleryRoutes');
// const testimonialRoutes = require('./routes/testimonialRoutes');
// const contactRoutes = require('./routes/contactRoutes');
// const quoteRoutes = require('./routes/quoteRoutes');
// const careerRoutes = require('./routes/careerRoutes');
// const uploadRoutes = require('./routes/uploadRoutes');

// // Mount routers
// app.use('/api/auth', authRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/gallery', galleryRoutes);
// app.use('/api/testimonials', testimonialRoutes);
// app.use('/api/contacts', contactRoutes);
// app.use('/api/quotes', quoteRoutes);
// app.use('/api/careers', careerRoutes);
// app.use('/api/upload', uploadRoutes);

// // Base route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to Logistics and Manpower API',
//     version: '1.0.0',
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     error: err.message || 'Server Error',
//   });
// });

// const PORT = process.env.PORT || 5000;

// let server;
// if (!process.env.VERCEL) {
//   server = app.listen(PORT, () => {
//     console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
//   });
// }

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`Error: ${err.message}`);
//   // Close server & exit process
//   if (server) {
//     server.close(() => process.exit(1));
//   } else {
//     process.exit(1);
//   }
// });

// module.exports = app;

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

// ========================================
// CORS CONFIGURATION
// ========================================

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL
      .split(',')
      .map((origin) => origin.trim().replace(/\/$/, ''))
  : [
      'http://localhost:3000',
      'http://localhost:5173',
    ];

console.log('CORS allowed origins:', allowedOrigins);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests without Origin
      // Example: Postman, server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      const cleanOrigin = origin.replace(/\/$/, '');

      if (allowedOrigins.includes(cleanOrigin)) {
        return callback(null, true);
      }

      console.log('CORS blocked:', origin);

      return callback(new Error('Not allowed by CORS'));
    },

    credentials: true,

    methods: [
      'GET',
      'POST',
      'PUT',
      'PATCH',
      'DELETE',
      'OPTIONS',
    ],

    allowedHeaders: [
      'Content-Type',
      'Authorization',
    ],
  })
);

// ========================================
// BODY PARSER
// ========================================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// DATABASE CONNECTION
// ========================================

connectDB();

// ========================================
// STATIC UPLOADS
// ========================================

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads'))
);

// ========================================
// ROUTES
// ========================================

const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const contactRoutes = require('./routes/contactRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const careerRoutes = require('./routes/careerRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/careers', careerRoutes);
app.use('/api/upload', uploadRoutes);

// ========================================
// BASE ROUTE
// ========================================

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Logistics and Manpower API',
    version: '1.0.0',
  });
});

// ========================================
// 404 HANDLER
// ========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
  });
});

// ========================================
// ERROR HANDLER
// ========================================

app.use((err, req, res, next) => {
  console.error('Server Error:', err);

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Server Error',
  });
});

// ========================================
// LOCAL SERVER
// ========================================

const PORT = process.env.PORT || 5000;

let server;

if (!process.env.VERCEL) {
  server = app.listen(PORT, () => {
    console.log(
      `Server running in ${
        process.env.NODE_ENV || 'development'
      } mode on port ${PORT}`
    );
  });
}

// ========================================
// UNHANDLED PROMISE REJECTION
// ========================================

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// ========================================
// EXPORT APP FOR VERCEL
// ========================================

module.exports = app;