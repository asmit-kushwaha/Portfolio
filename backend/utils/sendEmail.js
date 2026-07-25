const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  family: 4, // Force IPv4
  // CRITICAL: Stop Nodemailer from hanging forever
  connectionTimeout: 10000, // 10 seconds
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log(`[SMTP] Attempting to send email to ${to}...`);
    const info = await transporter.sendMail({
      from: `"Asmit Kushwaha Portfolio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('[SMTP] Success! Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('[SMTP] Error sending email:', error.message);
    // Return null instead of crashing, allowing the API response to proceed
    return null;
  }
};

module.exports = sendEmail;
