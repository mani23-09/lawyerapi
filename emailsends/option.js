const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
const port = 3800;
require("dotenv").config();
// Function to send email
async function sendEmail(recipientEmail, subject, text, html) {
    // Create a transporter using SMTP transport
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    // Message object
    let message = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: subject,
        text: text, // plain text body
        html: html // html body
    };

    // Send email
    let info = await transporter.sendMail(message);

    console.log('Message sent: %s', info.messageId);
}

// Define POST endpoint to send email
app.get('/sendEmail', (req, res) => {
    // Example email data
    const recipientEmail = "recipient@example.com";
    const subject = "Booking Confirmation";
    const text = "Do you want to book?";
    const html = "<h1>Booking Confirmation</h1><p>Do you want to book?</p><a href=\"http://yourdomain.com/book\"><button>Book</button></a><a href=\"http://yourdomain.com/notbook\"><button>Not Book</button></a>";

    // Send the email
    sendEmail(recipientEmail, subject, text, html)
        .then(() => res.send('Email sent successfully'))
        .catch(error => res.status(500).send(`Error sending email: ${error.message}`));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
