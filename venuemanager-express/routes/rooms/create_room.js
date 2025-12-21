/*
=======================================================================
API Route: create_room
=======================================================================
Method: POST
Purpose: Creates a new room for a venue. Requires authentication.
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "name": "The Montgomery",            // string, required
  "slug": "the-montgomery",            // string, required
  "description": "A spacious...",      // string, required
  "type": "double",                    // string, required (single|double|twin|suite|family)
  "sleeps": 2,                         // integer, required
  "features": ["King bed", "Views"],   // array, optional
  "images": [],                        // array, optional
  "price": {                           // object, optional
    "from": 120,
    "currency": "GBP"
  },
  "isAvailable": true,                 // boolean, optional (default true)
  "sortOrder": 1                       // integer, optional (default 0)
}

Success Response:
{
  "return_code": "SUCCESS",
  "room_id": 1
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"SLUG_EXISTS"
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

const logger = createRouteLogger('create_room');

router.post('/create_room', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const {
      venue_id, name, slug, description, type, sleeps,
      features, images, price, isAvailable = true, sortOrder = 0
    } = req.body;

    // Validate required fields
    if (!venue_id || !name || !slug || !description || !type || !sleeps) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id, name, slug, description, type, and sleeps are required'
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

    // Check slug doesn't exist
    const slugCheck = await query(
      'SELECT id FROM rooms WHERE venue_id = $1 AND slug = $2',
      [venue_id, slug]
    );
    if (slugCheck.rows.length > 0) {
      logger.response('SLUG_EXISTS', Date.now() - start);
      return res.json({
        return_code: 'SLUG_EXISTS',
        message: 'A room with this slug already exists'
      });
    }

    // Insert room
    const result = await query(
      `INSERT INTO rooms (venue_id, name, slug, description, type, sleeps, features, images, price_from, price_currency, is_available, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING id`,
      [
        venue_id,
        name,
        slug,
        description,
        type,
        sleeps,
        features || null,
        images || null,
        price?.from || null,
        price?.currency || 'GBP',
        isAvailable,
        sortOrder
      ]
    );

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      room_id: result.rows[0].id
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while creating room'
    });
  }
});

module.exports = router;
