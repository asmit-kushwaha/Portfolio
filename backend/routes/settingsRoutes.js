const express = require('express');
const router = express.Router();
const {
  getSettings,
  updateSettings,
  removeProfileImage,
  removeResume,
} = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getSettings);
router.put('/', protect, updateSettings);
router.delete('/profile-image', protect, removeProfileImage);
router.delete('/resume', protect, removeResume);

module.exports = router;