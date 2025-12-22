/*
=======================================================================
Database Connection
=======================================================================
Central PostgreSQL connection pool for the Venue Manager API.
All database access should go through this module.
=======================================================================
Usage:
  const { query } = require('./database');
  const result = await query('SELECT * FROM venues WHERE id = $1', [venueId]);
=======================================================================
*/

const { Pool } = require('pg');
const config = require('./config/config');

// Create connection pool
const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  max: 20, // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000 // Return error after 2 seconds if connection cannot be established
});

// Log connection errors only
pool.on('error', (err) => {
  console.error('Database: Unexpected error on idle client', err);
});

/**
 * Execute a SQL query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
async function query(text, params) {
  const start = Date.now();
  const result = await pool.query(text, params);
  const duration = Date.now() - start;

  // Log slow queries (over 500ms) - only genuinely slow ones
  if (duration > 500) {
    console.warn('Database: Slow query', { text, duration, rows: result.rowCount });
  }

  return result;
}

/**
 * Get a client from the pool for transactions
 * @returns {Promise<Object>} Pool client
 */
async function getClient() {
  const client = await pool.connect();
  return client;
}

module.exports = {
  query,
  getClient,
  pool
};
