const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(cors());

// Create a MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'hireciel', // your database name
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
  const query = 'SELECT jobID, selectedCandidates FROM job';
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
