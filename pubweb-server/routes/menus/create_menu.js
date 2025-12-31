/*
=======================================================================
API Route: create_menu
=======================================================================
Method: POST
Purpose: Creates a new menu for a venue. Requires authentication.
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "name": "Lunch Menu",                // string, required
  "slug": "lunch",                     // string, required (unique per venue)
  "description": "Available 12-3pm",   // string, optional
  "type": "regular",                   // string, optional (regular|event|drinks)
  "isActive": true,                    // boolean, optional (default true)
  "sortOrder": 1,                      // integer, optional (default 0)
  "pdfUrl": "https://...",             // string, optional
  "imageUrl": "https://...",           // string, optional
  "eventDateRange": {                  // object, optional (for event menus)
    "start": "2024-12-24",
    "end": "2024-12-26"
  }
}

Success Response:
{
  "return_code": "SUCCESS",
  "menu_id": 1
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

router.post('/create_menu', verifyToken, async (req, res) => {

  try {
    const {
      venue_id, name, slug, description, type = 'regular',
      isActive = true, sortOrder = 0, pdfUrl, imageUrl, eventDateRange
    } = req.body;

    // Validate required fields
    if (!venue_id || !name || !slug) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id, name, and slug are required'
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

    // Check slug doesn't already exist for this venue
    const slugCheck = await query(
      'SELECT id FROM menus WHERE venue_id = $1 AND slug = $2',
      [venue_id, slug]
    );
    if (slugCheck.rows.length > 0) {
      return res.json({
        return_code: 'SLUG_EXISTS',
        message: 'A menu with this slug already exists for this venue'
      });
    }

    // Insert menu
    const result = await query(
      `INSERT INTO menus (venue_id, name, slug, description, type, is_active, sort_order, pdf_url, image_url, event_start, event_end)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING id`,
      [
        venue_id,
        name,
        slug,
        description || null,
        type,
        isActive,
        sortOrder,
        pdfUrl || null,
        imageUrl || null,
        eventDateRange?.start || null,
        eventDateRange?.end || null
      ]
    );

    return res.json({
      return_code: 'SUCCESS',
      menu_id: result.rows[0].id
    });

  } catch (error) {
    console.error('create_menu error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while creating menu'
    });
  }
});

module.exports = router;
