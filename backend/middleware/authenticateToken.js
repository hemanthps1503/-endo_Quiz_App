const jwt = require('jsonwebtoken');

const JWT_SECRET = 'hemanth123';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.sendStatus(401); // Unauthorized
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.sendStatus(403); // Forbidden
    }
    console.log('Token verified successfully:', user);
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
