/*
=======================================================================
API Route: create_attraction
=======================================================================
Method: POST
Purpose: Creates a new local attraction. Requires authentication.
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "name": "Powis Castle",              // string, required
  "description": "Medieval castle...", // string, required
  "category": "heritage",              // string, required (heritage|nature|activities|dining|shopping|transport)
  "distance": "8 miles",               // string, optional
  "websiteUrl": "https://...",         // string, optional
  "image": "https://..."               // string, optional
}

Success Response:
{
  "return_code": "SUCCESS",
  "attraction_id": 1
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"INVALID_CATEGORY"
"UNAUTHORIZED"
"FORBIDDEN"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('create_attraction');

const VALID_CATEGORIES = ['heritage', 'nature', 'activities', 'dining', 'shopping', 'transport'];

router.post('/create_attraction', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { venue_id, name, description, category, distance, websiteUrl, image } = req.body;

    // Validate required fields
    if (!venue_id || !name || !description || !category) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id, name, description, and category are required'
      });
    }

    // Validate category
    if (!VALID_CATEGORIES.includes(category)) {
      logger.response('INVALID_CATEGORY', Date.now() - start);
      return res.json({
        return_code: 'INVALID_CATEGORY',
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`
      });
    }

    // Check user has access
    if (req.user.venue_id !== venue_id) {
      logger.response('FORBIDDEN', Date.now() - start);
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this venue'
      });
    }

    // Check venue exists
    const venueCheck = await query('SELECT id FROM venues WHERE id = $1', [venue_id]);
    if (venueCheck.rows.length === 0) {
      logger.response('VENUE_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'VENUE_NOT_FOUND',
        message: 'Venue not found'
      });
    }

    // Insert attraction
    const result = await query(
      `INSERT INTO attractions (venue_id, name, description, category, distance, website_url, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [venue_id, name, description, category, distance || null, websiteUrl || null, image || null]
    );

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      attraction_id: result.rows[0].id
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while creating attraction'
    });
  }
});

module.exports = router;
