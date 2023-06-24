const nodemailer = require("nodemailer");

const sendMailAttach = async (to, subject, text, attachmentPath, attachmentName) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    secure: true,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `${process.env.MAIL_USERNAME} ${process.env.MAIL_EMAIL}`,
    to,
    subject,
    text,
    attachments: [{ path: attachmentPath, filename: attachmentName }]
  };

  await transporter.sendMail(mailOptions);
};

const sendMail = async (to, subject, text, attachmentPath = null, attachmentName = null) => {
  if (attachmentPath && attachmentName) {
    await sendMailAttach(to, subject, text, attachmentPath, attachmentName);
  } else {
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
  }
};

module.exports = sendMail;