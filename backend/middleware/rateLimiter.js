const rateLimit = require('express-rate-limit');

// Limits contact form submissions to 5 per 15 minutes, per IP address.
// Prevents spam/abuse from flooding your inbox or racking up Nodemailer/Cloudinary usage.
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: 'Too many messages sent. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Slightly stricter limit on login attempts — helps against brute-force guessing.
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: 'Too many login attempts. Please try again in 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { contactLimiter, loginLimiter };