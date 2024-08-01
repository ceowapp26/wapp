import cron from 'node-cron';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import emailTemplates from './emailTemplates.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_MAILER_EMAIL,
    pass: process.env.NODE_MAILER_GMAIL_APP_PASSWORD,
  },
});

export const sendReminderEmails = async (mailOption) => {
  try {
    await transporter.sendMail(mailOption);
  } catch (error) {
    console.error(`Error sending email`, error);
  }
};

