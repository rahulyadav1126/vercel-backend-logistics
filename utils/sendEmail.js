const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  // Logging fallback if configuration is missing
  if (!host || !port || !user || !pass) {
    console.log('==================================================');
    console.log('EMAIL NOTIFICATION (SMTP not configured, logging to console)');
    console.log(`To: ${options.to || process.env.EMAIL_TO}`);
    console.log(`From: ${options.from || process.env.EMAIL_FROM}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Message: \n${options.text}`);
    if (options.html) {
      console.log(`HTML Message: \n${options.html}`);
    }
    console.log('==================================================');
    return { success: true, logged: true };
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: host,
    port: port,
    auth: {
      user: user,
      pass: pass,
    },
  });

  // Define message
  const message = {
    from: `${options.fromName || 'Logistics Co'} <${process.env.EMAIL_FROM || 'noreply@logisticsco.com'}>`,
    to: options.to || process.env.EMAIL_TO,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  const info = await transporter.sendMail(message);
  console.log(`Message sent: ${info.messageId}`);
  return info;
};

module.exports = sendEmail;
