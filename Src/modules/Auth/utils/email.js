import nodemailer from "nodemailer";

const sendEmail = async (to, subject, title, message) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family:Arial, sans-serif; line-height:1.6;">
      <h3>${title}</h3>
      <p>${message}</p>
      <p style="color:#555;">– DineFlow Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"DineFlow" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export default sendEmail;
