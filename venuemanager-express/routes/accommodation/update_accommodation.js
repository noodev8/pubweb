/*
=======================================================================
API Route: update_accommodation
=======================================================================
Method: POST
Purpose: Updates accommodation info for a venue. Requires authentication.
         Creates accommodation record if it doesn't exist.
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "description": "8 rooms...",         // string, optional
  "features": ["WiFi", "Breakfast"],   // array, optional
  "bookingUrl": "https://...",         // string, optional
  "bookingEmail": "book@venue.com"     // string, optional
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Accommodation updated successfully"
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
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('update_accommodation');

router.post('/update_accommodation', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { venue_id, description, features, bookingUrl, bookingEmail } = req.body;

    // Validate required fields
    if (!venue_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id is required'
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

    // Check if accommodation exists
    const accomCheck = await query('SELECT id FROM accommodation WHERE venue_id = $1', [venue_id]);

    if (accomCheck.rows.length === 0) {
      // Create new accommodation record
      await query(
        `INSERT INTO accommodation (venue_id, description, features, booking_url, booking_email)
         VALUES ($1, $2, $3, $4, $5)`,
        [venue_id, description || null, features || null, bookingUrl || null, bookingEmail || null]
      );
    } else {
      // Update existing
      const updates = [];
      const values = [];
      let paramIndex = 1;

      if (description !== undefined) {
        updates.push(`description = $${paramIndex++}`);
        values.push(description);
      }
      if (features !== undefined) {
        updates.push(`features = $${paramIndex++}`);
        values.push(features);
      }
      if (bookingUrl !== undefined) {
        updates.push(`booking_url = $${paramIndex++}`);
        values.push(bookingUrl);
      }
      if (bookingEmail !== undefined) {
        updates.push(`booking_email = $${paramIndex++}`);
        values.push(bookingEmail);
      }

      if (updates.length > 0) {
        values.push(venue_id);
        await query(
          `UPDATE accommodation SET ${updates.join(', ')} WHERE venue_id = $${paramIndex}`,
          values
        );
      }
    }

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Accommodation updated successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating accommodation'
    });
  }
});

module.exports = router;
