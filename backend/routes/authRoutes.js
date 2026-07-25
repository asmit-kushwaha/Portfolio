const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { loginLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerUser); // disabled after initial admin setup
router.post('/login', loginLimiter, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getMe);

module.exports = router;
