/*
=======================================================================================================================================
API Route: update_item
=======================================================================================================================================
Method: POST
Purpose: Updates a menu item and optionally its price variants. Requires authentication. When variants are provided,
         all existing variants are replaced with the new set. To remove all variants and use a single price, pass
         an empty variants array along with a price value.
=======================================================================================================================================
Request Payload:
{
  "item_id": 1,                        // integer, required - the item to update
  "name": "Fish & Chips",              // string, optional - item name
  "description": "Beer-battered cod",  // string, optional - item description
  "price": 12.95,                      // number, optional - single price (used when variants is empty)
  "priceNote": "per person",           // string, optional - note about the price
  "dietaryTags": ["gluten-free"],      // array, optional - dietary information
  "isAvailable": true,                 // boolean, optional - availability status
  "sortOrder": 1,                      // integer, optional - display order
  "variants": [{                       // array, optional - when provided, replaces ALL existing variants
    "id": "1",                         // string, optional - existing variant ID (for reference only)
    "label": "Small",                  // string, required - variant label
    "price": 9.95,                     // number, required - variant price
    "isDefault": true,                 // boolean, optional (default false) - default selection
    "isAvailable": true,               // boolean, optional (default true) - variant availability
    "sortOrder": 0                     // integer, optional (default 0) - display order
  }]
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Item updated successfully"
}
=======================================================================================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"ITEM_NOT_FOUND"
"UNAUTHORIZED"
"FORBIDDEN"
"SERVER_ERROR"
=======================================================================================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { withTransaction } = require('../../utils/transaction');
const { verifyToken } = require('../../middleware/auth');

router.post('/update_item', verifyToken, async (req, res) => {

  try {
    const {
      item_id, name, description, price, priceNote,
      dietaryTags, isAvailable, sortOrder, variants
    } = req.body;

    // Validate required fields
    if (!item_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'item_id is required'
      });
    }

    // Validate variants array if provided
    if (variants !== undefined && variants !== null) {
      if (!Array.isArray(variants)) {
        return res.json({
          return_code: 'MISSING_FIELDS',
          message: 'variants must be an array'
        });
      }
      for (const variant of variants) {
        if (!variant.label || variant.price === undefined || variant.price === null) {
          return res.json({
            return_code: 'MISSING_FIELDS',
            message: 'Each variant must have a label and price'
          });
        }
      }
    }

    // Check item exists and get venue_id through section and menu
    // This single query verifies the item exists and gets the venue for permission check
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

    // Check user has access to this venue
    if (req.user.venue_id !== item.venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this item'
      });
    }

    // Use a transaction to update item and variants atomically
    await withTransaction(async (client) => {
      // Build update query dynamically based on provided fields
      // Only update fields that were explicitly provided in the request
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

      // Handle price field based on whether variants are being set
      // If variants array is provided and non-empty, clear the item price (use variants instead)
      // If variants array is empty, allow setting a single price
      // If variants not provided, update price if explicitly set
      if (variants !== undefined) {
        if (variants.length > 0) {
          // Using variants - clear the single price
          updates.push(`price = $${paramIndex++}`);
          values.push(null);
        } else if (price !== undefined) {
          // Empty variants array + price provided = switch to single price mode
          updates.push(`price = $${paramIndex++}`);
          values.push(price);
        }
      } else if (price !== undefined) {
        // No variants in request, but price provided - update single price
        updates.push(`price = $${paramIndex++}`);
        values.push(price);
      }

      // Execute item update if there are fields to update
      if (updates.length > 0) {
        values.push(item_id);
        await client.query(
          `UPDATE menu_items SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
          values
        );
      }

      // Handle variants update if variants array was provided
      // Strategy: Delete all existing variants and insert the new set
      // This is simpler than trying to diff and update individual variants
      if (variants !== undefined) {
        // Delete all existing variants for this item
        await client.query(
          'DELETE FROM menu_item_variants WHERE item_id = $1',
          [item_id]
        );

        // Insert new variants if any were provided
        if (variants.length > 0) {
          for (let i = 0; i < variants.length; i++) {
            const variant = variants[i];
            await client.query(
              `INSERT INTO menu_item_variants (item_id, label, price, is_default, is_available, sort_order)
               VALUES ($1, $2, $3, $4, $5, $6)`,
              [
                item_id,
                variant.label,
                variant.price,
                variant.isDefault || false,
                variant.isAvailable !== false, // Default to true if not specified
                variant.sortOrder !== undefined ? variant.sortOrder : i // Use index as default sort order
              ]
            );
          }
        }
      }
    });

    return res.json({
      return_code: 'SUCCESS',
      message: 'Item updated successfully'
    });

  } catch (error) {
    console.error('update_item error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating item'
    });
  }
});

module.exports = router;
