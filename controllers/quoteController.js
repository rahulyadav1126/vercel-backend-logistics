const Quote = require('../models/Quote');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new quote request
// @route   POST /api/quotes
// @access  Public
exports.createQuote = async (req, res) => {
  const {
    name,
    email,
    phone,
    serviceType,
    companySize,
    pickupLocation,
    deliveryLocation,
    message,
  } = req.body;

  try {
    const quote = await Quote.create({
      name,
      email,
      phone,
      serviceType,
      companySize,
      pickupLocation,
      deliveryLocation,
      message,
    });

    // Send notification email to admin
    const emailText = `
You have received a new quote request:

Name: ${name}
Email: ${email}
Phone: ${phone}
Service Type: ${serviceType}
Company Size: ${companySize || 'N/A'}
Pickup Location: ${pickupLocation || 'N/A'}
Delivery Location: ${deliveryLocation || 'N/A'}
Message:
${message}

Please log in to your admin panel to reply.
    `;

    try {
      await sendEmail({
        to: process.env.EMAIL_TO || 'admin@logisticsco.com',
        subject: `New Quote Request: ${serviceType}`,
        text: emailText,
      });
    } catch (emailErr) {
      console.error(`Email delivery failed: ${emailErr.message}`);
    }

    res.status(201).json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all quote requests
// @route   GET /api/quotes
// @access  Private/Admin
exports.getQuotes = async (req, res) => {
  try {
    const quotes = await Quote.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: quotes.length, data: quotes });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update quote request status
// @route   PUT /api/quotes/:id
// @access  Private/Admin
exports.updateQuoteStatus = async (req, res) => {
  try {
    let quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ success: false, error: 'Quote request not found' });
    }

    quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: quote });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete quote request
// @route   DELETE /api/quotes/:id
// @access  Private/Admin
exports.deleteQuote = async (req, res) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) {
      return res.status(404).json({ success: false, error: 'Quote request not found' });
    }

    await Quote.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
