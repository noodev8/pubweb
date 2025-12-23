/*
=======================================================================
API Route: create_section
=======================================================================
Method: POST
Purpose: Creates a new section within a menu. Requires authentication.
=======================================================================
Request Payload:
{
  "menu_id": 1,                        // integer, required
  "name": "Starters",                  // string, required
  "description": "To share or solo",   // string, optional
  "sortOrder": 1                       // integer, optional (default 0)
}

Success Response:
{
  "return_code": "SUCCESS",
  "section_id": 1
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"MENU_NOT_FOUND"
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

const logger = createRouteLogger('create_section');

router.post('/create_section', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { menu_id, name, description, sortOrder = 0 } = req.body;

    // Validate required fields
    if (!menu_id || !name) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'menu_id and name are required'
      });
    }

    // Check menu exists and get venue_id
    const menuCheck = await query('SELECT id, venue_id FROM menus WHERE id = $1', [menu_id]);
    if (menuCheck.rows.length === 0) {
      logger.response('MENU_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'MENU_NOT_FOUND',
        message: 'Menu not found'
      });
    }

    const menu = menuCheck.rows[0];

    // Check user has access to this venue
    if (req.user.venue_id !== menu.venue_id) {
      logger.response('FORBIDDEN', Date.now() - start);
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this menu'
      });
    }

    // Insert section
    const result = await query(
      `INSERT INTO menu_sections (menu_id, name, description, sort_order)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [menu_id, name, description || null, sortOrder]
    );

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      section_id: result.rows[0].id
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while creating section'
    });
  }
});

module.exports = router;
