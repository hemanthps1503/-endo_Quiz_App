const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const router = express.Router();
require('dotenv').config();

const generateOrUpdatePDF = async (username, totalQuestions, correctAnswers, wrongAnswers) => {
  const filePath = path.join(__dirname, '../test-results.pdf');
  const newResult = `Username: ${username}            Total Questions: ${totalQuestions}  Correct Answers: ${correctAnswers}\n`;

  let pdfDoc;
  let yOffset = 750; // Start position for text

  if (fs.existsSync(filePath)) {
    const existingPdfBytes = fs.readFileSync(filePath);
    pdfDoc = await PDFDocument.load(existingPdfBytes);
  } else {
    pdfDoc = await PDFDocument.create();
  }

  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const pages = pdfDoc.getPages();
  let page;

  if (pages.length > 0) {
    page = pages[pages.length - 1];
    const { height } = page.getSize();
    const textHeight = height - yOffset; // Calculate used space on the page
    if (textHeight + 100 > height) { // If there is not enough space, add a new page
      page = pdfDoc.addPage();
      yOffset = 750;
    } else {
      yOffset -= textHeight; // Adjust yOffset for existing text
    }
  } else {
    page = pdfDoc.addPage();
  }

  const textLines = newResult.split('\n');
  const fontSize = 12;

  textLines.forEach(line => {
    if (yOffset < 50) { // Check if the current page has enough space
      page = pdfDoc.addPage();
      yOffset = 750;
    }

    page.drawText(line, {
      x: 50,
      y: yOffset,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    yOffset -= fontSize + 10; // Move the yOffset for the next line
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(filePath, pdfBytes);

  return filePath;
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
      to: 'hemanth66ps@gmail.com',
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
