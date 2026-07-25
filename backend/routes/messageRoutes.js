const express = require('express');
const router = express.Router();

const {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
} = require('../controllers/messageController');

const { protect } = require('../middleware/authMiddleware');
const { contactLimiter } = require('../middleware/rateLimiter');

router.post('/', contactLimiter, createMessage);
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
