const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Changed from 465 to 587
  secure: false, // Must be false for 587 (uses STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  family: 4, // force IPv4 — needed on Render
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Asmit Kushwaha Portfolio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', info.messageId, 'to', to);
  } catch (error) {
    console.error('Email failed to send:', error.message);
    // We don't throw here — email failure shouldn't break the contact form
  }
};

module.exports = sendEmail;
