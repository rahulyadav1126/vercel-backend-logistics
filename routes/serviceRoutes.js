const express = require('express');
const router = express.Router();
const {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getServices)
  .post(protect, authorize('admin', 'superadmin'), createService);

router.route('/:id')
  .get(getService)
  .put(protect, authorize('admin', 'superadmin'), updateService)
  .delete(protect, authorize('admin', 'superadmin'), deleteService);

module.exports = router;
