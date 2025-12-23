/*
=======================================================================
API Route: update_item
=======================================================================
Method: POST
Purpose: Updates a menu item. Requires authentication.
=======================================================================
Request Payload:
{
  "item_id": 1,                        // integer, required
  "name": "Soup of the Day",           // string, optional
  "description": "With crusty bread",  // string, optional
  "price": 6.50,                       // number, optional
  "priceNote": "per person",           // string, optional
  "dietaryTags": ["vegetarian"],       // array, optional
  "isAvailable": true,                 // boolean, optional
  "sortOrder": 1                       // integer, optional
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Item updated successfully"
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

const logger = createRouteLogger('update_item');

router.post('/update_item', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const {
      item_id, name, description, price, priceNote,
      dietaryTags, isAvailable, sortOrder
    } = req.body;

    // Validate required fields
    if (!item_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'item_id is required'
      });
    }

    // Check item exists and get venue_id through section and menu
    const itemCheck = await query(
      `SELECT i.id, m.venue_id
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

    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (price !== undefined) {
      updates.push(`price = $${paramIndex++}`);
      values.push(price);
    }
    if (priceNote !== undefined) {
      updates.push(`price_note = $${paramIndex++}`);
      values.push(priceNote);
    }
    if (dietaryTags !== undefined) {
      updates.push(`dietary_tags = $${paramIndex++}`);
      values.push(dietaryTags);
    }
    if (isAvailable !== undefined) {
      updates.push(`is_available = $${paramIndex++}`);
      values.push(isAvailable);
    }
    if (sortOrder !== undefined) {
      updates.push(`sort_order = $${paramIndex++}`);
      values.push(sortOrder);
    }

    if (updates.length === 0) {
      logger.response('SUCCESS', Date.now() - start);
      return res.json({
        return_code: 'SUCCESS',
        message: 'No changes to update'
      });
    }

    values.push(item_id);

    await query(
      `UPDATE menu_items SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Item updated successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating item'
    });
  }
});

module.exports = router;
