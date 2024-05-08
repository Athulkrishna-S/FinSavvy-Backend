import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import handlebars from 'handlebars';

dotenv.config(); // Load environment variables from .env file

const sendEmail = async (to, subject, templateData) => {
  // Create a nodemailer transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com', // Outlook SMTP server
    port: 587, // Port for TLS/STARTTLS
    secure: false, // false for TLS - as a boolean not string - if true the port is 465
    auth: {
      user: process.env.EMAIL_USER, // Retrieve email address from environment variable
      pass: process.env.EMAIL_PASSWORD // Retrieve email password from environment variable
    }
  });

  // Read the HTML email template file
  const templateFile = fs.readFileSync('services/emailTemplate.html', 'utf-8');

  // Compile the template
  const template = handlebars.compile(templateFile);

  // Generate HTML content from template and data
  const html = template(templateData);

  const mailOptions = {
    from: process.env.EMAIL_USER, // Retrieve email address from environment variable
    to: to,
    subject: subject,
    html: html // Use HTML content instead of plain text
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
};



export default sendEmail;