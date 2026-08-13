const express = require('express');
const router = express.Router();
const {
  createQuote,
  getQuotes,
  updateQuoteStatus,
  deleteQuote,
} = require('../controllers/quoteController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .post(createQuote)
  .get(protect, authorize('admin', 'superadmin'), getQuotes);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateQuoteStatus)
  .delete(protect, authorize('admin', 'superadmin'), deleteQuote);

module.exports = router;
