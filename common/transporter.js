// common/transporter.js
import nodemailer from "nodemailer";

// Create a transporter using SMTP authentication
const transporter = nodemailer.createTransport({
  host: process.env.MAILER_HOST,          // e.g., 'smtp.yourdomain.com'
  port: process.env.MAILER_PORT,          // e.g., 587 (TLS) or 465 (SSL)
  secure: process.env.MAILER_PORT == 465, // Use SSL/TLS if port is 465, otherwise false
  auth: {
    user: process.env.MAILER_USERNAME,   // SMTP username (e.g., 'yourusername@yourdomain.com')
    pass: process.env.MAILER_PASSWORD,   // SMTP password (corresponding to the user)
  },
});

export default transporter;