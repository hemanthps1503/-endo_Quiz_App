const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const router = express.Router();
require('dotenv').config();

const generateOrUpdatePDF = async (username, totalQuestions, correctAnswers, wrongAnswers) => {
  const filePath = path.join(__dirname, '../test-results.pdf');
  const tempFilePath = path.join(__dirname, '../temp-results.pdf');
  const newResult = `Username: ${username}    Total Questions: ${totalQuestions}    Correct Answers: ${correctAnswers}    Wrong Answers: ${wrongAnswers}\n\n`;

  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(tempFilePath);

    doc.pipe(writeStream);

    // Append existing entries if the file exists
    if (fs.existsSync(filePath)) {
      const existingPDF = fs.readFileSync(filePath);
      doc.text(existingPDF.toString());
    }

    // Append new result
    doc.text(newResult);
    doc.end();

    writeStream.on('finish', () => {
      fs.renameSync(tempFilePath, filePath);
      console.log('PDF updated successfully');
      resolve(filePath);
    });

    writeStream.on('error', (err) => {
      console.error('Error updating PDF:', err);
      reject(err);
    });
  });
};

router.post('/send-email', async (req, res) => {
  const { email, username, totalQuestions, correctAnswers, wrongAnswers } = req.body;

  try {
    console.log('Generating PDF...');
    const filePath = await generateOrUpdatePDF(username, totalQuestions, correctAnswers, wrongAnswers);
    console.log('PDF generated at:', filePath);

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    let mailOptions = {
      from: `"Quiz App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Quiz Test Report',
      text: `Hi ${username},\n\nYour quiz report is attached as a PDF.\n\nBest regards,\nQuiz App Team`,
      attachments: [
        {
          filename: 'test-results.pdf',
          path: filePath,
        },
      ],
    };

    console.log('Sending email to:', email);
    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Error sending email', details: error.message });
  }
});

module.exports = router;
