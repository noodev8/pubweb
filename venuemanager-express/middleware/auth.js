/*
=======================================================================
Authentication Middleware
=======================================================================
JWT verification middleware for protected routes.
Only stores user ID in token - fetch additional data from database as needed.
=======================================================================
*/

const jwt = require('jsonwebtoken');
const config = require('../config/config');
const { query } = require('../database');

/**
 * Verify JWT token and attach user to request
 * Use this middleware for routes that require authentication
 */
async function verifyToken(req, res, next) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({
        return_code: 'UNAUTHORIZED',
        message: 'No token provided'
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwt.secret);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        return res.json({
          return_code: 'TOKEN_EXPIRED',
          message: 'Token has expired'
        });
      }
      return res.json({
        return_code: 'INVALID_TOKEN',
        message: 'Invalid token'
      });
    }

    // Fetch user from database to ensure they still exist
    const userResult = await query(
      'SELECT id, venue_id, email, name, role FROM app_users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.json({
        return_code: 'USER_NOT_FOUND',
        message: 'User no longer exists'
      });
    }

    // Attach user to request object
    req.user = userResult.rows[0];

    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'Authentication error'
    });
  }
}

/**
 * Optional authentication - attach user if token present, continue otherwise
 * Use for routes that work with or without authentication
 */
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    // No token - continue without user
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(' ')[1];

    // Try to verify token
    try {
      const decoded = jwt.verify(token, config.jwt.secret);

      const userResult = await query(
        'SELECT id, venue_id, email, name, role FROM app_users WHERE id = $1',
        [decoded.userId]
      );

      req.user = userResult.rows.length > 0 ? userResult.rows[0] : null;
    } catch (err) {
      // Invalid or expired token - continue without user
      req.user = null;
    }

    next();
  } catch (error) {
    console.error('Optional auth error:', error);
    req.user = null;
    next();
  }
}

/**
 * Generate JWT token for a user
 * @param {number} userId - The user's ID
 * @returns {string} JWT token
 */
function generateToken(userId) {
  return jwt.sign(
    { userId },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

module.exports = {
  verifyToken,
  optionalAuth,
  generateToken
};
