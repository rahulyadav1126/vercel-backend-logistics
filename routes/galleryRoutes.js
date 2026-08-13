const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect, authorize } = require('../middleware/auth');

router.route('/')
  .get(getGalleryItems)
  .post(protect, authorize('admin', 'superadmin'), createGalleryItem);

router.route('/:id')
  .put(protect, authorize('admin', 'superadmin'), updateGalleryItem)
  .delete(protect, authorize('admin', 'superadmin'), deleteGalleryItem);

module.exports = router;
