const nodemailer = require("nodemailer");
exports.mailSender = async (email, title, body) => {
  try {
    // create a transporter
    let transporter = nodemailer.createTransport({
      service:'gmail',
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });
    let info = await transporter.sendMail({// forgot await due to which: 'error in sending an email was occurred!'
      from: `${process.env.MAIL_USER}`,
      to: `${email}`,
      subject: `New Message on StudyNotion - ${title}`,
      html: `${body}`,
    });
    console.log(info);
    return info;
  } catch (error) {
    console.log(
      "error in sending Mail at nodeMailer.js line : 3-20",
      error.message
    );
  }
};
