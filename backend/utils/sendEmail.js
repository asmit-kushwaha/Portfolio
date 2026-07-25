const nodemailer = require('nodemailer');
 
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for port 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  family: 4, // force IPv4 — some hosts (like Render) can't reach Gmail over IPv6
});
 
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Your Name Portfolio" <${process.env.EMAIL_USER}>`,
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
