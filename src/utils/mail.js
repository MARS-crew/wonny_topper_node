const nodemailer = require("nodemailer");

const sendMail = async (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    secure: true,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `${process.env.MAIL_USERNAME} ${process.env.MAIL_EMAIL}`,
    to,
    subject,
    text,
  });
};

module.exports = sendMail;