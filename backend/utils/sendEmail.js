const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log(`[Email API] Sending email to: ${to}...`);

    const data = await resend.emails.send({
      // Resend allows testing emails using onboard@resend.dev without needing custom domain setup
      from: 'Portfolio Contact <onboard@resend.dev>',
      to: [to],
      subject: subject,
      html: html,
    });

    console.log('[Email API] Success! Message ID:', data.id);
    return data;
  } catch (error) {
    console.error('[Email API Error]:', error.message);
    return null;
  }
};

module.exports = sendEmail;
