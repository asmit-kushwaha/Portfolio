const Message = require('../models/Message');
const sendEmail = require('../utils/sendEmail');

// @desc    Submit a contact message (public)
// @route   POST /api/messages
const createMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // 1. Save message to MongoDB
    const newMessage = await Message.create({ name, email, message });

    // 2. Respond immediately to unblock the frontend UI
    res.status(201).json({
      message: 'Message sent successfully',
      data: newMessage,
    });

    // 3. Trigger email tasks in parallel in background
    Promise.allSettled([
      // Confirmation to sender
      sendEmail({
        to: email,
        subject: 'Thanks for reaching out!',
        html: `
          <p>Hi ${name},</p>
          <p>Thanks for contacting me through my portfolio. I've received your message and will get back to you soon.</p>
          <p><strong>Your message:</strong></p>
          <p style="color:#555;">${message}</p>
          <br/>
          <p>Best Regards,<br/>Asmit</p>
        `,
      }),
      // Notification to yourself
      sendEmail({
        to: process.env.EMAIL_USER,
        subject: `New portfolio message from ${name}`,
        html: `
          <p>You've got a new message from your portfolio contact form:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p style="color:#555;">${message}</p>
        `,
      }),
    ]).then(() => {
      console.log('[Controller] Background emails processed.');
    });

  } catch (error) {
    console.error('[Controller Error]:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all messages (admin only)
// @route   GET /api/messages
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark message as read (admin only)
// @route   PUT /api/messages/:id/read
const markAsRead = async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message (admin only)
// @route   DELETE /api/messages/:id
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.status(200).json({ message: 'Message deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMessage,
  getMessages,
  markAsRead,
  deleteMessage,
};
