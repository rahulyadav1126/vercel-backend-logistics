const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Service = require('../models/Service');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Contact = require('../models/Contact');
const Quote = require('../models/Quote');
const Career = require('../models/Career');
const Application = require('../models/Application');

// Helper to sign JWT token
const getSignedToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// @desc    Admin Login
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    // Sign token
    const token = getSignedToken(user._id);

    // Return profile (except password)
    const userProfile = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(200).json({
      success: true,
      token,
      user: userProfile,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get Current User
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get Admin Dashboard Analytics
// @route   GET /api/auth/stats
// @access  Private/Admin
exports.getStats = async (req, res) => {
  try {
    const servicesCount = await Service.countDocuments();
    const galleryCount = await Gallery.countDocuments();
    const testimonialsCount = await Testimonial.countDocuments();
    const contactsCount = await Contact.countDocuments();
    const quotesCount = await Quote.countDocuments();
    const careersCount = await Career.countDocuments();
    const applicationsCount = await Application.countDocuments();

    // Pending leads
    const pendingContacts = await Contact.countDocuments({ status: 'Pending' });
    const pendingQuotes = await Quote.countDocuments({ status: 'Pending' });
    const pendingApplications = await Application.countDocuments({ status: 'Applied' });

    // Recent Quotes
    const recentQuotes = await Quote.find().sort({ createdAt: -1 }).limit(5);
    // Recent Contacts
    const recentContacts = await Contact.find().sort({ createdAt: -1 }).limit(5);

  
    
    res.status(200).json({
      success: true,
      data: {
        stats: {
          services: servicesCount,
          gallery: galleryCount,
          testimonials: testimonialsCount,
          contacts: contactsCount,
          quotes: quotesCount,
          careers: careersCount,
          applications: applicationsCount,
          pendingContacts,
          pendingQuotes,
          pendingApplications,
        },
        recentQuotes,
        recentContacts,
      },
    });



  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
