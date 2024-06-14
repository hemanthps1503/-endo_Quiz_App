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

// Fetch results for a specific user
router.get('/users/:userId/results', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const [results] = await pool.promise().query(
      'SELECT r.id, r.score, q.name AS quiz_name, q.total_questions, (q.total_questions * 5) AS total_points FROM results r JOIN quizzes q ON r.quiz_id = q.id WHERE r.user_id = ?',
      [userId]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save quiz result
router.post('/results', authenticateToken, async (req, res) => {
  const { user_id, quiz_id, score } = req.body;
  try {
    await pool.promise().query('INSERT INTO results (user_id, quiz_id, score) VALUES (?, ?, ?)', [user_id, quiz_id, score]);
    res.status(201).json({ message: 'Result saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
