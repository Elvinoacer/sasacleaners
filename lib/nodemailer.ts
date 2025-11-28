import nodemailer from 'nodemailer';

const email = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
  auth: {
    user: email,
    pass,
  },
});

export const mailOptions = {
  from: process.env.SMTP_FROM_EMAIL || email,
};
