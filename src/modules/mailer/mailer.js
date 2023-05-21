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

export function sendMail(title, targetMail, content) {
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: targetMail,
    subject: title,
    text: content,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
}

export function arrayToContent(arrayData) {
  const content = arrayData.map((item) => {
    let line1 = `Title: ${item.title}\n`;
    let line2 = `Meta: ${item.meta}\n`;
    let line3 = `Link: ${item.url}\n` || "no link";
    let breakLine = `------------------------\n`;

    return line1 + line2 + line3 + "\n\n" + breakLine;
  });

  return content.join(" ");
}
