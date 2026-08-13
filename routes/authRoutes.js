const express = require('express');
const router = express.Router();
const { login, getMe, getStats } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/login', login);
router.get('/me', protect, getMe);
router.get('/stats', protect, getStats);

module.exports = router;
