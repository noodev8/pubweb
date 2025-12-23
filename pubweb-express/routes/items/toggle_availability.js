/*
=======================================================================
API Route: toggle_availability
=======================================================================
Method: POST
Purpose: Quick toggle for item availability (86 button). Requires authentication.
         Toggles the current availability state of an item.
=======================================================================
Request Payload:
{
  "item_id": 1                         // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "isAvailable": false,
  "message": "Item is now unavailable"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"ITEM_NOT_FOUND"
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

const logger = createRouteLogger('toggle_availability');

router.post('/toggle_availability', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { item_id } = req.body;

    // Validate required fields
    if (!item_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'item_id is required'
      });
    }

    // Check item exists and get current state and venue_id
    const itemCheck = await query(
      `SELECT i.id, i.is_available, m.venue_id
       FROM menu_items i
       JOIN menu_sections s ON s.id = i.section_id
       JOIN menus m ON m.id = s.menu_id
       WHERE i.id = $1`,
      [item_id]
    );

    if (itemCheck.rows.length === 0) {
      logger.response('ITEM_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'ITEM_NOT_FOUND',
        message: 'Item not found'
      });
    }

    const item = itemCheck.rows[0];

    // Check user has access
    if (req.user.venue_id !== item.venue_id) {
      logger.response('FORBIDDEN', Date.now() - start);
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this item'
      });
    }

    // Toggle availability
    const newAvailability = !item.is_available;

    await query(
      'UPDATE menu_items SET is_available = $1 WHERE id = $2',
      [newAvailability, item_id]
    );

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      isAvailable: newAvailability,
      message: newAvailability ? 'Item is now available' : 'Item is now unavailable (86\'d)'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while toggling availability'
    });
  }
});

module.exports = router;
