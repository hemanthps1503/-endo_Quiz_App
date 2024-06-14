const express = require('express');
const router = express.Router();
const pool = require('../db/db');
const authenticateToken = require('../middleware/authenticateToken');

// Fetch all quizzes
router.get('/quizzes', authenticateToken, async (req, res) => {
  try {
    const [quizzes] = await pool.promise().query('SELECT * FROM quizzes');
    res.json(quizzes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch questions for a specific quiz
router.get('/quizzes/:quizId/questions', authenticateToken, async (req, res) => {
  const quizId = req.params.quizId;
  try {
    const [questions] = await pool.promise().query('SELECT * FROM questions WHERE quiz_id = ?', [quizId]);
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});




module.exports = router;
