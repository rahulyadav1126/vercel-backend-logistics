const express = require('express');
const router = express.Router();
const {
  createContact,
  getContacts,
  updateContactStatus,
  deleteContact,
} = require('../controllers/contactController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(createContact)
  .get(protect, authorize('admin', 'superadmin'), getContacts);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateContactStatus)
  .delete(protect, authorize('admin', 'superadmin'), deleteContact);

module.exports = router;
