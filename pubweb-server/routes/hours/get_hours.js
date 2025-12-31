/*
=======================================================================
API Route: get_hours
=======================================================================
Method: POST
Purpose: Returns opening hours for a venue including regular hours and special closures.
=======================================================================
Request Payload:
{
  "venue_id": 1                        // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "hours": {
    "regular": [
      {
        "day": "monday",
        "isClosed": false,
        "periods": [
          { "open": "12:00", "close": "15:00" },
          { "open": "18:00", "close": "23:00" }
        ]
      }
    ],
    "specialClosures": [
      {
        "date": "2024-12-25",
        "reason": "Christmas Day",
        "isClosed": true,
        "periods": null
      }
    ]
  }
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');

router.post('/get_hours', async (req, res) => {

  try {
    const { venue_id } = req.body;

    // Validate required fields
    if (!venue_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id is required'
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

    // Fetch regular hours
    const hoursResult = await query(
      `SELECT day, is_closed, periods
       FROM opening_hours
       WHERE venue_id = $1
       ORDER BY CASE day
         WHEN 'monday' THEN 1
         WHEN 'tuesday' THEN 2
         WHEN 'wednesday' THEN 3
         WHEN 'thursday' THEN 4
         WHEN 'friday' THEN 5
         WHEN 'saturday' THEN 6
         WHEN 'sunday' THEN 7
       END`,
      [venue_id]
    );

    // Fetch special closures
    const closuresResult = await query(
      `SELECT date, reason, is_closed, periods
       FROM special_closures
       WHERE venue_id = $1 AND date >= CURRENT_DATE
       ORDER BY date`,
      [venue_id]
    );

    // Format response to match TypeScript types
    const hours = {
      regular: hoursResult.rows.map(h => ({
        day: h.day,
        isClosed: h.is_closed,
        periods: h.periods || undefined
      })),
      specialClosures: closuresResult.rows.length > 0 ? closuresResult.rows.map(c => ({
        date: c.date.toISOString().split('T')[0],
        reason: c.reason || undefined,
        isClosed: c.is_closed,
        periods: c.periods || undefined
      })) : undefined
    };

    return res.json({
      return_code: 'SUCCESS',
      hours
    });

  } catch (error) {
    console.error('get_hours error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while fetching hours'
    });
  }
});

module.exports = router;
