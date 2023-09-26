
const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const path = require('path');

// Serve static files from the frontend directory
app.use(express.static(path.join(__dirname, '../frontend')));

// Enable CORS
app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hireCielDB', // Your database name
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Create an API endpoint to fetch job data
app.get('/api/jobdata', (req, res) => {
  const query = 'SELECT DATE_FORMAT(candOfferJoinAddedTs, "%Y-%m") AS month, SUM(CASE WHEN InterviewProcessId = 11 THEN 1 ELSE 0 END) AS totalJoinees, COUNT(*) AS totalOffers FROM tbl_cand_offer_joined GROUP BY month;';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error executing SQL query: ' + err.stack);
      res.status(500).json({ error: 'Internal Server Error' });
      return;
    }
    res.json(results);
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});