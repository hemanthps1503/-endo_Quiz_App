const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
require('dotenv').config();

router.post('/send-email', async (req, res) => {
  const { email, totalQuestions, correctAnswers, wrongAnswers } = req.body;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your email from environment variables
      pass: process.env.EMAIL_PASS  // Your email password from environment variables
    }
  });

  let mailOptions = {
    from: `"Quiz App" <${process.env.EMAIL_USER}>`, // sender address
    to: email, // list of receivers
    subject: 'Quiz Test Report', // Subject line
    text: `You have completed the quiz.\n\nTotal Questions: ${totalQuestions}\nCorrect Answers: ${correctAnswers}\nWrong Answers: ${wrongAnswers}`, // plain text body
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error); // Log the error for debugging
    res.status(500).json({ error: 'Error sending email' });
  }
});

module.exports = router;
