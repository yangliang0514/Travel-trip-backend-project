const nodemailer = require("nodemailer");

module.exports = async (options) => {
  // 1. Create a transporter (mail service)
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2. define the email options
  const mailOptions = {
    from: "Kevin Yang <Kevin@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3. Sending the email
  await transporter.sendMail(mailOptions);
};
