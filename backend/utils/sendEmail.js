const nodemailer = require('nodemailer');
const dns = require('dns');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // TLS / STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  // FORCE IPv4 at the DNS lookup level (bypasses Node v17+ IPv6 default preference)
  lookup: (hostname, options, callback) => {
    dns.lookup(hostname, { family: 4 }, callback);
  },
  connectionTimeout: 10000,
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
    return null;
  }
};

module.exports = sendEmail;
