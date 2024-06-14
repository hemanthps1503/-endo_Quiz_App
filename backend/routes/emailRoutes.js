const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const PDFDocument = require('pdfkit');
const path = require('path');
const router = express.Router();
require('dotenv').config();

const generateOrUpdatePDF = async (totalQuestions, correctAnswers, wrongAnswers) => {
  const filePath = path.join(__dirname, '../test-results.pdf');
  const newResult = `Total Questions: ${totalQuestions}\nCorrect Answers: ${correctAnswers}\nWrong Answers: ${wrongAnswers}\n\n`;

  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      console.log('PDF already exists. Appending new results...');
      // Append new result to existing PDF
      const existingPDF = fs.readFileSync(filePath);
      const tempFilePath = path.join(__dirname, '../temp-results.pdf');
      const tempDoc = new PDFDocument();
      const tempStream = fs.createWriteStream(tempFilePath);

      tempDoc.pipe(tempStream);
      tempDoc.text(existingPDF.toString());
      tempDoc.text(newResult);
      tempDoc.end();

      tempStream.on('finish', () => {
        fs.renameSync(tempFilePath, filePath);
        console.log('PDF updated successfully');
        resolve(filePath);
      });

      tempStream.on('error', (err) => {
        console.error('Error updating PDF:', err);
        reject(err);
      });
    } else {
      console.log('Creating a new PDF with the result...');
      // Create new PDF with the result
      const doc = new PDFDocument();
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);
      doc.text(newResult);
      doc.end();

      writeStream.on('finish', () => {
        console.log('PDF generated successfully');
        resolve(filePath);
      });

      writeStream.on('error', (err) => {
        console.error('Error generating PDF:', err);
        reject(err);
      });
    }
  });
};

router.post('/send-email', async (req, res) => {
  const { email, username, totalQuestions, correctAnswers, wrongAnswers } = req.body;

  try {
    console.log('Generating PDF...');
    const filePath = await generateOrUpdatePDF(totalQuestions, correctAnswers, wrongAnswers);
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
