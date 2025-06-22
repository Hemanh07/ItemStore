const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
const mailSender = async (mailId, title, body) => {
  try {
    let transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: "crazydeveloperr007@gmail.com",
        pass: process.env.MAIL_PASS,
      },
    });
    let info = await transporter.sendMail({
      from: "crazydeveloperr007@gmail.com",
      to: mailId,
      subject: title,
      html: body,
    });
    return info;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = { mailSender };
