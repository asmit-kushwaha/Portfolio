const Message = require('../models/Message');
const sendEmail = require('../utils/sendEmail');

const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1. Save to database FIRST
    console.log('[Controller] Saving message to MongoDB...');
    const newMessage = await Message.create({ name, email, message });
    console.log('[Controller] Message saved with ID:', newMessage._id);

    // 2. Send response back to Frontend IMMEDIATELY so button unfreezes
    res.status(201).json({ 
      message: 'Message sent successfully', 
      data: newMessage 
    });

    // 3. Send emails in background (won't block frontend button)
    Promise.allSettled([
      sendEmail({
        to: email,
        subject: 'Thanks for reaching out!',
        html: `<p>Hi ${name}, thanks for reaching out! I will get back to you soon.</p>`,
      }),
      sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New portfolio message from ${name}`,
        html: `<p><strong>From:</strong> ${name} (${email})</p><p>${message}</p>`,
      }),
    ]).then(() => {
      console.log('[Controller] Background email tasks finished.');
    });

  } catch (error) {
    console.error('[Controller Error]:', error.message);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createMessage /* ... existing exports ... */ };
