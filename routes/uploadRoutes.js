const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect, authorize } = require('../middleware/auth');

// @desc    Upload file (Admins only)
// @route   POST /api/upload
// @access  Private/Admin
router.post('/', protect, authorize('admin', 'superadmin'), upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'Please upload a file' });
    }

    const fileUrl = (req.file.path && req.file.path.startsWith('http')) ? req.file.path : `/uploads/${req.file.filename}`;
    res.status(200).json({
      success: true,
      url: fileUrl,
      filename: req.file.filename,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
