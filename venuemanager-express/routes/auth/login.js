/*
=======================================================================
API Route: login
=======================================================================
Method: POST
Purpose: Authenticates a user using their email and password.
         Returns a JWT token and basic user details upon success.
=======================================================================
Request Payload:
{
  "email": "admin@nagshead.com",      // string, required
  "password": "securepassword123"      // string, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@nagshead.com",
    "venue_id": 1
  }
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"INVALID_CREDENTIALS"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { query } = require('../../database');
const { generateToken } = require('../../middleware/auth');
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('login');

router.post('/login', async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const userResult = await query(
      'SELECT id, venue_id, email, name, password_hash, role FROM app_users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      logger.response('INVALID_CREDENTIALS', Date.now() - start);
      return res.json({
        return_code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    const user = userResult.rows[0];

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.password_hash);

    if (!passwordValid) {
      logger.response('INVALID_CREDENTIALS', Date.now() - start);
      return res.json({
        return_code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      });
    }

    // Update last login timestamp
    await query(
      'UPDATE app_users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
      [user.id]
    );

    // Generate JWT token
    const token = generateToken(user.id);

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        venue_id: user.venue_id
      }
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred during login'
    });
  }
});

module.exports = router;
