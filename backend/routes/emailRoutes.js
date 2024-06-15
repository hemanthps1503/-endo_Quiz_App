const express = require('express');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const router = express.Router();
require('dotenv').config();

const generateOrUpdatePDF = async (username, totalQuestions, correctAnswers, wrongAnswers) => {
  const filePath = path.join(__dirname, '../test-results.pdf');
  const newResult = `Username: ${username}\nTotal Questions: ${totalQuestions}\nCorrect Answers: ${correctAnswers}\nWrong Answers: ${wrongAnswers}\n\n`;

  let pdfDoc;

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
  } else {
    page = pdfDoc.addPage();
  }

  const { height } = page.getSize();
  const fontSize = 12;
  const text = newResult.split('\n');
  let yOffset = height - 24;

  if (pages.length > 0) {
    const lastPageTextHeight = (text.length * fontSize) + 24;
    if (yOffset < lastPageTextHeight) {
      page = pdfDoc.addPage();
      yOffset = height - 24;
    }
  }

  text.forEach(line => {
    page.drawText(line, {
      x: 50,
      y: yOffset,
      size: fontSize,
      font: timesRomanFont,
      color: rgb(0, 0, 0),
    });
    yOffset -= fontSize + 8;
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
