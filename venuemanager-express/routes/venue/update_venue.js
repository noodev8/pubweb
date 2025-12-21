/*
=======================================================================
API Route: update_venue
=======================================================================
Method: POST
Purpose: Updates venue information. Requires authentication.
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "name": "The Nags Head Inn",         // string, optional
  "tagline": "A traditional inn...",   // string, optional
  "description": "...",                // string, optional
  "address": {                         // object, optional
    "line1": "Garthmyl",
    "line2": null,
    "town": "Montgomery",
    "county": "Powys",
    "postcode": "SY15 6RS",
    "country": "United Kingdom"
  },
  "contact": {                         // object, optional
    "phone": "01686 640600",
    "email": "info@nagshead.com",
    "bookingEmail": "bookings@nagshead.com"
  },
  "social": {                          // object, optional
    "facebook": "https://...",
    "instagram": "https://...",
    "twitter": null,
    "tripadvisor": "https://..."
  }
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Venue updated successfully"
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

const logger = createRouteLogger('update_venue');

router.post('/update_venue', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { venue_id, name, tagline, description, address, contact, social } = req.body;

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

    // Build update query dynamically based on provided fields
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (tagline !== undefined) {
      updates.push(`tagline = $${paramIndex++}`);
      values.push(tagline);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }

    // Address fields
    if (address) {
      if (address.line1 !== undefined) {
        updates.push(`address_line1 = $${paramIndex++}`);
        values.push(address.line1);
      }
      if (address.line2 !== undefined) {
        updates.push(`address_line2 = $${paramIndex++}`);
        values.push(address.line2);
      }
      if (address.town !== undefined) {
        updates.push(`town = $${paramIndex++}`);
        values.push(address.town);
      }
      if (address.county !== undefined) {
        updates.push(`county = $${paramIndex++}`);
        values.push(address.county);
      }
      if (address.postcode !== undefined) {
        updates.push(`postcode = $${paramIndex++}`);
        values.push(address.postcode);
      }
      if (address.country !== undefined) {
        updates.push(`country = $${paramIndex++}`);
        values.push(address.country);
      }
    }

    // Contact fields
    if (contact) {
      if (contact.phone !== undefined) {
        updates.push(`phone = $${paramIndex++}`);
        values.push(contact.phone);
      }
      if (contact.email !== undefined) {
        updates.push(`email = $${paramIndex++}`);
        values.push(contact.email);
      }
      if (contact.bookingEmail !== undefined) {
        updates.push(`booking_email = $${paramIndex++}`);
        values.push(contact.bookingEmail);
      }
    }

    // Social fields
    if (social) {
      if (social.facebook !== undefined) {
        updates.push(`facebook = $${paramIndex++}`);
        values.push(social.facebook);
      }
      if (social.instagram !== undefined) {
        updates.push(`instagram = $${paramIndex++}`);
        values.push(social.instagram);
      }
      if (social.twitter !== undefined) {
        updates.push(`twitter = $${paramIndex++}`);
        values.push(social.twitter);
      }
      if (social.tripadvisor !== undefined) {
        updates.push(`tripadvisor = $${paramIndex++}`);
        values.push(social.tripadvisor);
      }
    }

    // If no updates provided
    if (updates.length === 0) {
      logger.response('SUCCESS', Date.now() - start);
      return res.json({
        return_code: 'SUCCESS',
        message: 'No changes to update'
      });
    }

    // Add updated_at and venue_id
    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(venue_id);

    // Execute update
    await query(
      `UPDATE venues SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Venue updated successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating venue'
    });
  }
});

module.exports = router;
