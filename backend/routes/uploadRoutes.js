const express = require('express');
const router = express.Router();
const { upload, uploadResume } = require('../middleware/uploadMiddleware');
const { protect } = require('../middleware/authMiddleware');

// @desc   Upload a single image (admin only)
// @route  POST /api/upload
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ url: req.file.path, publicId: req.file.filename });
});

// @desc   Upload resume PDF (admin only)
// @route  POST /api/upload/resume
router.post('/resume', protect, uploadResume.single('resume'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  res.status(200).json({ url: req.file.path, publicId: req.file.filename });
});

module.exports = router;