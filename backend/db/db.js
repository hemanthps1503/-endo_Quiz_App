const mysql = require('mysql2');

const pool = mysql.createPool({
  connectionLimit: 10,  // Adjust as needed
  host: 'quiz-app-db.cvucwm84awwu.eu-north-1.rds.amazonaws.com',
  user: 'admin',
  password: 'admin123',
  database: 'quiz_app',
  port: 3306,
  waitForConnections: true,
  queueLimit: 0
});

module.exports = pool;
