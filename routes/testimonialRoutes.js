const express = require('express');
const router = express.Router();
const {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} = require('../controllers/testimonialController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getTestimonials)
  .post(protect, authorize('admin', 'superadmin'), createTestimonial);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateTestimonial)
  .delete(protect, authorize('admin', 'superadmin'), deleteTestimonial);

module.exports = router;
