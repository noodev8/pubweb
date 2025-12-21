/*
=======================================================================
API Route: create_item
=======================================================================
Method: POST
Purpose: Creates a new menu item within a section. Requires authentication.
=======================================================================
Request Payload:
{
  "section_id": 1,                     // integer, required
  "name": "Soup of the Day",           // string, required
  "description": "With crusty bread",  // string, optional
  "price": 6.50,                       // number, optional
  "priceNote": "per person",           // string, optional
  "dietaryTags": ["vegetarian"],       // array, optional
  "isAvailable": true,                 // boolean, optional (default true)
  "sortOrder": 1                       // integer, optional (default 0)
}

Success Response:
{
  "return_code": "SUCCESS",
  "item_id": 1
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"SECTION_NOT_FOUND"
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

const logger = createRouteLogger('create_item');

router.post('/create_item', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const {
      section_id, name, description, price, priceNote,
      dietaryTags, isAvailable = true, sortOrder = 0
    } = req.body;

    // Validate required fields
    if (!section_id || !name) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'section_id and name are required'
      });
    }

    // Check section exists and get venue_id through menu
    const sectionCheck = await query(
      `SELECT s.id, m.venue_id
       FROM menu_sections s
       JOIN menus m ON m.id = s.menu_id
       WHERE s.id = $1`,
      [section_id]
    );

    if (sectionCheck.rows.length === 0) {
      logger.response('SECTION_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'SECTION_NOT_FOUND',
        message: 'Section not found'
      });
    }

    const section = sectionCheck.rows[0];

    // Check user has access to this venue
    if (req.user.venue_id !== section.venue_id) {
      logger.response('FORBIDDEN', Date.now() - start);
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this section'
      });
    }

    // Insert item
    const result = await query(
      `INSERT INTO menu_items (section_id, name, description, price, price_note, dietary_tags, is_available, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id`,
      [
        section_id,
        name,
        description || null,
        price || null,
        priceNote || null,
        dietaryTags || null,
        isAvailable,
        sortOrder
      ]
    );

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      item_id: result.rows[0].id
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while creating item'
    });
  }
});

module.exports = router;
