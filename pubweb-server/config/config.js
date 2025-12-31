/*
=======================================================================
Configuration
=======================================================================
Central configuration for the Venue Manager API.
All environment variables should be accessed through this module.
=======================================================================
*/

require('dotenv').config();

module.exports = {
  // Database configuration
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'venuemanager',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  },

  // Server configuration
  server: {
    port: parseInt(process.env.PORT) || 3001
  }
};
