const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  careerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Career',
    required: true,
  },
  applicantName: {
    type: String,
    required: [true, 'Please add applicant name'],
    trim: true,
  },
  applicantEmail: {
    type: String,
    required: [true, 'Please add applicant email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  applicantPhone: {
    type: String,
    required: [true, 'Please add applicant phone number'],
  },
  resumeUrl: {
    type: String,
    required: [true, 'Please upload a resume'],
  },
  coverLetter: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Applied', 'Reviewed', 'Rejected', 'Shortlisted'],
    default: 'Applied',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Application', applicationSchema);
