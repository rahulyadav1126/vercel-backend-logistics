const Career = require('../models/Career');
const Application = require('../models/Application');
const sendEmail = require('../utils/sendEmail');

// ==========================================
// CAREER JOB OPENINGS CONTROLLER ACTIONS
// ==========================================

// @desc    Get all active careers (Public)
// @route   GET /api/careers
// @access  Public
exports.getCareers = async (req, res) => {
  try {
    const careers = await Career.find({ active: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: careers.length, data: careers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get all careers including inactive (Admin)
// @route   GET /api/careers/all
// @access  Private/Admin
exports.getAllCareers = async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: careers.length, data: careers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Get single career
// @route   GET /api/careers/:id
// @access  Public
exports.getCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, error: 'Job opening not found' });
    }
    res.status(200).json({ success: true, data: career });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Create job opening
// @route   POST /api/careers
// @access  Private/Admin
exports.createCareer = async (req, res) => {
  try {
    const career = await Career.create(req.body);
    res.status(201).json({ success: true, data: career });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Update job opening
// @route   PUT /api/careers/:id
// @access  Private/Admin
exports.updateCareer = async (req, res) => {
  try {
    let career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, error: 'Job opening not found' });
    }

    career = await Career.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, data: career });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete job opening
// @route   DELETE /api/careers/:id
// @access  Private/Admin
exports.deleteCareer = async (req, res) => {
  try {
    const career = await Career.findById(req.params.id);
    if (!career) {
      return res.status(404).json({ success: false, error: 'Job opening not found' });
    }

    await Career.findByIdAndDelete(req.params.id);
    // Delete associated applications
    await Application.deleteMany({ careerId: req.params.id });

    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ==========================================
// JOB APPLICATIONS CONTROLLER ACTIONS
// ==========================================

// @desc    Apply for job
// @route   POST /api/careers/:id/apply
// @access  Public (Multipart Form-Data)
exports.applyForJob = async (req, res) => {
  try {
    const careerId = req.params.id;
    const career = await Career.findById(careerId);
    if (!career) {
      return res.status(404).json({ success: false, error: 'Job opening not found' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a resume file' });
    }

    const { applicantName, applicantEmail, applicantPhone, coverLetter } = req.body;

    const resumeUrl = (req.file.path && req.file.path.startsWith('http')) ? req.file.path : `/uploads/${req.file.filename}`;

    const application = await Application.create({
      careerId,
      applicantName,
      applicantEmail,
      applicantPhone,
      resumeUrl,
      coverLetter,
    });

    // Send email to admin
    const emailText = `
New job application received!

Position: ${career.title}
Department: ${career.department}
Applicant: ${applicantName}
Email: ${applicantEmail}
Phone: ${applicantPhone}
Cover Letter:
${coverLetter || 'No cover letter provided'}

Resume Path: ${resumeUrl}

Please log in to your admin panel to view full details and download the resume.
    `;

    try {
      await sendEmail({
        to: process.env.EMAIL_TO || 'admin@logisticsco.com',
        subject: `New Application: ${career.title} - ${applicantName}`,
        text: emailText,
      });
    } catch (emailErr) {
      console.error(`Email notification failed: ${emailErr.message}`);
    }

    res.status(201).json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get all applications
// @route   GET /api/careers/applications
// @access  Private/Admin
exports.getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('careerId', 'title department location')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: applications.length, data: applications });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// @desc    Update application status
// @route   PUT /api/careers/applications/:id
// @access  Private/Admin
exports.updateApplicationStatus = async (req, res) => {
  try {
    let application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    application = await Application.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete application
// @route   DELETE /api/careers/applications/:id
// @access  Private/Admin
exports.deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }

    await Application.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};
