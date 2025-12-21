/*
=======================================================================
Transaction Utility
=======================================================================
Wrapper for PostgreSQL transactions.
Use this for operations that need to be atomic.
=======================================================================
Usage:
  const { withTransaction } = require('../utils/transaction');

  await withTransaction(async (client) => {
    await client.query('INSERT INTO menus ...');
    await client.query('INSERT INTO menu_sections ...');
    // If any query fails, all changes are rolled back
  });
=======================================================================
*/

const { getClient } = require('../database');

/**
 * Execute a function within a database transaction
 * @param {Function} fn - Async function that receives a client and performs queries
 * @returns {Promise<any>} Result of the function
 * @throws {Error} If the function throws, transaction is rolled back
 */
async function withTransaction(fn) {
  const client = await getClient();

  try {
    // Start transaction
    await client.query('BEGIN');

    // Execute the function with the client
    const result = await fn(client);

    // Commit on success
    await client.query('COMMIT');

    return result;
  } catch (error) {
    // Rollback on error
    await client.query('ROLLBACK');
    throw error;
  } finally {
    // Release client back to pool
    client.release();
  }
}

module.exports = {
  withTransaction
};
