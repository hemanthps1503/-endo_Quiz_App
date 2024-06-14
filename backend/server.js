const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const quizRoutes = require('./routes/quizRoutes');
const userRoutes = require('./routes/userRoutes');
const tokenRoutes = require('./routes/tokenRoutes'); 
const emailRoutes = require('./routes/emailRoutes');
const pool = require('./db/db');  // Import the database connection
require('dotenv').config(); 

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use('/api', quizRoutes);
app.use('/api/users', userRoutes);
app.use('/api', tokenRoutes);
app.use('/api', emailRoutes);





// Check database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Database connected successfully');
    connection.release();  // Release the connection back to the pool
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
