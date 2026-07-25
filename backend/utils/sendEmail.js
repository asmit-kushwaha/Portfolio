const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // false for port 587 (uses STARTTLS)
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  family: 4, // force IPv4 for Render network compatibility
  connectionTimeout: 10000, // 10s timeout
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log(`[SMTP] Attempting to send email to: ${to}`);
    const info = await transporter.sendMail({
      from: `"Asmit Kushwaha Portfolio" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('[SMTP] Success! Message ID:', info.messageId);
    return info;
  } catch (error) {
    console.error('[SMTP Error]:', error.message);
    return null; // Don't throw — keep background execution safe
  }
};

module.exports = sendEmail;
