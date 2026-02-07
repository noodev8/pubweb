/*
=======================================================================
API Route: reorder_images (menu images)
=======================================================================
Method: POST
Purpose: Bulk updates sort_order for menu images. Requires authentication.
=======================================================================
Request Payload:
{
  "menu_id": 1,                       // integer, required
  "order": [                           // array of {id, sortOrder}
    { "id": 3, "sortOrder": 0 },
    { "id": 1, "sortOrder": 1 },
    { "id": 2, "sortOrder": 2 }
  ]
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Menu images reordered successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"FORBIDDEN"
"MENU_NOT_FOUND"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');


router.post('/reorder_images', verifyToken, async (req, res) => {

  try {
    const { menu_id, order } = req.body;

    // Validate required fields
    if (!menu_id || !order || !Array.isArray(order)) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'menu_id and order array are required'
      });
    }

    // Check menu exists and get venue_id
    const menuCheck = await query('SELECT id, venue_id FROM menus WHERE id = $1', [menu_id]);
    if (menuCheck.rows.length === 0) {
      return res.json({
        return_code: 'MENU_NOT_FOUND',
        message: 'Menu not found'
      });
    }

    const menu = menuCheck.rows[0];

    // Check user has access
    if (req.user.venue_id !== menu.venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this menu'
      });
    }

    // Update sort_order for each image
    for (const item of order) {
      if (item.id && typeof item.sortOrder === 'number') {
        await query(
          `UPDATE menu_images
           SET sort_order = $1
           WHERE id = $2 AND menu_id = $3`,
          [item.sortOrder, item.id, menu_id]
        );
      }
    }

    return res.json({
      return_code: 'SUCCESS',
      message: 'Menu images reordered successfully'
    });

  } catch (error) {
    console.error('menu reorder_images error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while reordering menu images'
    });
  }
});

module.exports = router;
