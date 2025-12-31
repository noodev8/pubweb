/*
=======================================================================
API Route: delete_item
=======================================================================
Method: POST
Purpose: Deletes a menu item. Requires authentication.
=======================================================================
Request Payload:
{
  "item_id": 1                         // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Item deleted successfully"
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

router.post('/delete_item', verifyToken, async (req, res) => {

  try {
    const { item_id } = req.body;

    // Validate required fields
    if (!item_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'item_id is required'
      });
    }

    // Check item exists and get venue_id
    const itemCheck = await query(
      `SELECT i.id, m.venue_id
       FROM menu_items i
       JOIN menu_sections s ON s.id = i.section_id
       JOIN menus m ON m.id = s.menu_id
       WHERE i.id = $1`,
      [item_id]
    );

    if (itemCheck.rows.length === 0) {
      return res.json({
        return_code: 'ITEM_NOT_FOUND',
        message: 'Item not found'
      });
    }

    const item = itemCheck.rows[0];

    // Check user has access
    if (req.user.venue_id !== item.venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this item'
      });
    }

    // Delete item
    await query('DELETE FROM menu_items WHERE id = $1', [item_id]);

    return res.json({
      return_code: 'SUCCESS',
      message: 'Item deleted successfully'
    });

  } catch (error) {
    console.error('delete_item error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while deleting item'
    });
  }
});

module.exports = router;
