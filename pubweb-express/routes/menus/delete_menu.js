/*
=======================================================================
API Route: delete_menu
=======================================================================
Method: POST
Purpose: Deletes a menu and all its sections and items. Requires authentication.
=======================================================================
Request Payload:
{
  "menu_id": 1                         // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Menu deleted successfully"
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

const logger = createRouteLogger('delete_menu');

router.post('/delete_menu', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { menu_id } = req.body;

    // Validate required fields
    if (!menu_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'menu_id is required'
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

    // Delete menu (CASCADE will delete sections and items)
    await query('DELETE FROM menus WHERE id = $1', [menu_id]);

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Menu deleted successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while deleting menu'
    });
  }
});

module.exports = router;
