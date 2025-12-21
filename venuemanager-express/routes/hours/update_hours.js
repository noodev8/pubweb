/*
=======================================================================
API Route: update_hours
=======================================================================
Method: POST
Purpose: Updates opening hours for a venue. Requires authentication.
         Can update regular hours and/or special closures.
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "regular": [                         // array, optional - replaces all regular hours
    {
      "day": "monday",
      "isClosed": false,
      "periods": [
        { "open": "12:00", "close": "15:00" },
        { "open": "18:00", "close": "23:00" }
      ]
    }
  ],
  "specialClosures": [                 // array, optional - replaces all special closures
    {
      "date": "2024-12-25",
      "reason": "Christmas Day",
      "isClosed": true,
      "periods": null
    }
  ]
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Hours updated successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"UNAUTHORIZED"
"FORBIDDEN"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');
const { withTransaction } = require('../../utils/transaction');
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('update_hours');

router.post('/update_hours', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { venue_id, regular, specialClosures } = req.body;

    // Validate required fields
    if (!venue_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id is required'
      });
    }

    // Check user has access to this venue
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

    // Use transaction to update hours atomically
    await withTransaction(async (client) => {
      // Update regular hours if provided
      if (regular && Array.isArray(regular)) {
        // Delete existing regular hours
        await client.query('DELETE FROM opening_hours WHERE venue_id = $1', [venue_id]);

        // Insert new regular hours
        for (const dayHours of regular) {
          await client.query(
            `INSERT INTO opening_hours (venue_id, day, is_closed, periods)
             VALUES ($1, $2, $3, $4)`,
            [venue_id, dayHours.day, dayHours.isClosed, JSON.stringify(dayHours.periods)]
          );
        }
      }

      // Update special closures if provided
      if (specialClosures && Array.isArray(specialClosures)) {
        // Delete existing special closures
        await client.query('DELETE FROM special_closures WHERE venue_id = $1', [venue_id]);

        // Insert new special closures
        for (const closure of specialClosures) {
          await client.query(
            `INSERT INTO special_closures (venue_id, date, reason, is_closed, periods)
             VALUES ($1, $2, $3, $4, $5)`,
            [venue_id, closure.date, closure.reason, closure.isClosed, closure.periods ? JSON.stringify(closure.periods) : null]
          );
        }
      }
    });

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Hours updated successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating hours'
    });
  }
});

module.exports = router;
