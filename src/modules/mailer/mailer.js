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

export function sendMail(data) {
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: "kevin.kuehle@googlemail.com",
    subject: "🛣️ Degewo Neue Anzeige mit Waldsassener Straße!",
    text: data,
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
    let line3 = `Link: ${item?.url || "no url"}\n`;
    let breakLine = `------------------------\n`;

    return line1 + line2 + line3 + breakLine;
  });

  console.log(`devlog: content`, content.join(" "));

  return content.join(" ");
}
