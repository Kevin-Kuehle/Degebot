import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USERNAME,
    pass: process.env.GMAIL_PASSWORD,
  },
});

const mailOptions = {
  from: process.env.GMAIL_USERNAME,
  to: "kevin.kuehle@googlemail.com",
  subject: "Hello from Node.js",
  text: "This is a test email sent from Node.js using nodemailer.",
};

export function sendMail() {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}
