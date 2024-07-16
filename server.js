console.log('Starting the server...');

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();

app.use(cors());
app.use(bodyParser.json());

function checkAuthorizationHeader(req, res, next) {
  let authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header is missing' });
  }

  authHeader = authHeader.replace("Basic", "");
  const base64Auth = authHeader.trim();
  const splitArray = Buffer.from(base64Auth, 'base64').toString('ascii').split(":");
  const user = splitArray[0];
  const password = splitArray[1];
  
  // This is just a placeholder for actual authorization logic
  if (user && password) {
    next();
  } else {
    res.status(401).json({ error: 'Invalid authorization credentials' });
  }
}

const port = 3000;

// Middleware
app.use(checkAuthorizationHeader);
console.log('Middleware configured...');

// PostgreSQL Pool setup
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: 'Nitish@123',
  port: 5432,
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database...');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
  process.exit(-1);
});

// API Endpoints
app.get('/customers', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers');
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching customers:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching customer:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/customers', async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query('INSERT INTO customers (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating customer:', err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/customers/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const result = await pool.query('UPDATE customers SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating customer:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/customers/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM customers WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/customers', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM customers WHERE id = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error('Error deleting customer:', err);
    res.status(500).json({ error: err.message });
  }
});

// Start the server
app.listen(port, (err) => {
  if (err) {
    console.error('Error starting server:', err);
    process.exit(1);
  } else {
    console.log(`Server is running on port ${port}`);
  }
});
