const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'hemanth123';

// Token validation route
router.get('/validate-token', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    console.log('No token provided in validate-token route');
    return res.status(401).json({ valid: false });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed in validate-token route:', err.message);
      return res.status(403).json({ valid: false });
    }
    console.log('Token validated successfully in validate-token route:', user);
    res.status(200).json({ valid: true });
  });
});

module.exports = router;
