const express = require('express');
const router = express.Router();
const {
  getCareers,
  getAllCareers,
  getCareer,
  createCareer,
  updateCareer,
  deleteCareer,
  applyForJob,
  getApplications,
  updateApplicationStatus,
  deleteApplication,
} = require('../controllers/careerController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Admin Application management (placed first)
router.route('/applications')
  .get(protect, authorize('admin', 'superadmin'), getApplications);

router.route('/applications/:id')
  .put(protect, authorize('admin', 'superadmin'), updateApplicationStatus)
  .delete(protect, authorize('admin', 'superadmin'), deleteApplication);

// Career postings
router.route('/all')
  .get(protect, authorize('admin', 'superadmin'), getAllCareers);

router.route('/')
  .get(getCareers)
  .post(protect, authorize('admin', 'superadmin'), createCareer);

router.route('/:id')
  .get(getCareer)
  .put(protect, authorize('admin', 'superadmin'), updateCareer)
  .delete(protect, authorize('admin', 'superadmin'), deleteCareer);

// Job application submit route
router.route('/:id/apply')
  .post(upload.single('resume'), applyForJob);

module.exports = router;
