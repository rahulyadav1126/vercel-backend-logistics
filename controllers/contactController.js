const Contact = require('../models/Contact');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new contact lead
// @route   POST /api/contacts
// @access  Public
exports.createContact = async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  try {
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
    });

    // Send notification email to admin
    const emailText = `
You have received a new contact lead:

Name: ${name}
Email: ${email}
Phone: ${phone}
Subject: ${subject}
Message:
${message}

Please log in to your admin panel to reply.
    `;

    try {
      await sendEmail({
        to: process.env.EMAIL_TO || 'admin@logisticsco.com',
        subject: `New Contact Submission: ${subject}`,
        text: emailText,
      });
    } catch (emailErr) {
      console.error(`Email delivery failed: ${emailErr.message}`);
      // Don't fail the whole request if email config is bad, we still saved the contact!
    }

    res.status(201).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all contact leads
// @route   GET /api/contacts
// @access  Private/Admin
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: contacts.length, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update contact status
// @route   PUT /api/contacts/:id
// @access  Private/Admin
exports.updateContactStatus = async (req, res) => {
  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact lead not found' });
    }

    contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: contact });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete contact lead
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ success: false, error: 'Contact lead not found' });
    }

    await Contact.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
