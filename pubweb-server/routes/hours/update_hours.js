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
  ],
  "specialNotice": "Closed Mon & Tue in Jan/Feb"  // string, optional - displays on website
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

router.post('/update_hours', verifyToken, async (req, res) => {

  try {
    const { venue_id, regular, specialClosures, specialNotice } = req.body;

    // Validate required fields
    if (!venue_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id is required'
      });
    }

    // Check user has access to this venue
    if (req.user.venue_id !== venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this venue'
      });
    }

    // Check venue exists
    const venueCheck = await query('SELECT id FROM venues WHERE id = $1', [venue_id]);
    if (venueCheck.rows.length === 0) {
      return res.json({
        return_code: 'VENUE_NOT_FOUND',
        message: 'Venue not found'
      });
    }

    // Update special notice if provided (can be empty string to clear)
    if (specialNotice !== undefined) {
      await query(
        'UPDATE venues SET special_hours_notice = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [specialNotice || null, venue_id]
      );
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

    return res.json({
      return_code: 'SUCCESS',
      message: 'Hours updated successfully'
    });

  } catch (error) {
    console.error('update_hours error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating hours'
    });
  }
});

module.exports = router;
