const express = require('express');
const router = express.Router();
const { authUser, registerUser, getProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getProfile);

module.exports = router;
