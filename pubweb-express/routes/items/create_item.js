/*
=======================================================================================================================================
API Route: create_item
=======================================================================================================================================
Method: POST
Purpose: Creates a new menu item within a section. Requires authentication. Items can have either a single price
         or multiple price variants (e.g., Small/Large). When variants are provided, the single price is ignored.
=======================================================================================================================================
Request Payload:
{
  "section_id": 1,                     // integer, required - the section to add the item to
  "name": "Fish & Chips",              // string, required - item name
  "description": "Beer-battered cod",  // string, optional - item description
  "price": 12.95,                      // number, optional - single price (ignored if variants provided)
  "priceNote": "per person",           // string, optional - note about the price
  "dietaryTags": ["gluten-free"],      // array, optional - dietary information
  "isAvailable": true,                 // boolean, optional (default true) - availability status
  "sortOrder": 1,                      // integer, optional (default 0) - display order
  "variants": [{                       // array, optional - price variants (e.g., Small/Large)
    "label": "Small",                  // string, required - variant label
    "price": 9.95,                     // number, required - variant price
    "isDefault": true,                 // boolean, optional (default false) - default selection
    "isAvailable": true,               // boolean, optional (default true) - variant availability
    "sortOrder": 0                     // integer, optional (default 0) - display order
  }, {
    "label": "Large",
    "price": 14.95,
    "isDefault": false,
    "isAvailable": true,
    "sortOrder": 1
  }]
}

Success Response:
{
  "return_code": "SUCCESS",
  "item_id": 1
}
=======================================================================================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"SECTION_NOT_FOUND"
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
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('create_item');

router.post('/create_item', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const {
      section_id, name, description, price, priceNote,
      dietaryTags, isAvailable = true, sortOrder = 0, variants
    } = req.body;

    // Validate required fields
    if (!section_id || !name) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'section_id and name are required'
      });
    }

    // Validate variants array if provided
    if (variants && Array.isArray(variants)) {
      for (const variant of variants) {
        if (!variant.label || variant.price === undefined || variant.price === null) {
          logger.response('MISSING_FIELDS', Date.now() - start);
          return res.json({
            return_code: 'MISSING_FIELDS',
            message: 'Each variant must have a label and price'
          });
        }
      }
    }

    // Check section exists and get venue_id through menu
    // This single query verifies the section exists and gets the venue for permission check
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

    // Determine the price to store on the item
    // If variants are provided, we don't store a price on the item itself
    // The price comes from the variants instead
    const itemPrice = (variants && variants.length > 0) ? null : (price || null);

    // Use a transaction to insert item and variants atomically
    // If variants insertion fails, the item insert is rolled back
    const itemId = await withTransaction(async (client) => {
      // Insert the menu item
      const itemResult = await client.query(
        `INSERT INTO menu_items (section_id, name, description, price, price_note, dietary_tags, is_available, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         RETURNING id`,
        [
          section_id,
          name,
          description || null,
          itemPrice,
          priceNote || null,
          dietaryTags || null,
          isAvailable,
          sortOrder
        ]
      );

      const newItemId = itemResult.rows[0].id;

      // Insert variants if provided
      // Each variant is a separate row in menu_item_variants table
      if (variants && variants.length > 0) {
        for (let i = 0; i < variants.length; i++) {
          const variant = variants[i];
          await client.query(
            `INSERT INTO menu_item_variants (item_id, label, price, is_default, is_available, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              newItemId,
              variant.label,
              variant.price,
              variant.isDefault || false,
              variant.isAvailable !== false, // Default to true if not specified
              variant.sortOrder !== undefined ? variant.sortOrder : i // Use index as default sort order
            ]
          );
        }
      }

      return newItemId;
    });

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      item_id: itemId
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
