/*
=======================================================================================================================================
API Route: get_menu
=======================================================================================================================================
Method: POST
Purpose: Returns a single menu by ID with its sections, items, and price variants. Items can have either a single price
         or multiple variants (e.g., Small/Large). The response includes both for flexibility.
=======================================================================================================================================
Request Payload:
{
  "menu_id": 1                         // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "menu": {
    "id": "1",
    "name": "Lunch Menu",
    "slug": "lunch",
    "description": "Available 12-2pm",
    "type": "regular",
    "isActive": true,
    "sortOrder": 1,
    "pdfUrl": "https://...",
    "imageUrl": "https://...",
    "eventDateRange": { "start": "2025-12-25", "end": "2025-12-26" },
    "sections": [{
      "id": "1",
      "name": "Starters",
      "description": "To share or enjoy solo",
      "sortOrder": 1,
      "items": [{
        "id": "1",
        "name": "Soup of the Day",
        "description": "With crusty bread",
        "price": 6.50,                 // Single price (when no variants)
        "priceNote": "per person",
        "dietaryTags": ["vegetarian"],
        "isAvailable": true,
        "sortOrder": 1,
        "variants": []                 // Empty when using single price
      }, {
        "id": "2",
        "name": "Fish & Chips",
        "description": "Beer-battered cod",
        "price": null,                 // Null when using variants
        "dietaryTags": ["gluten-free"],
        "isAvailable": true,
        "sortOrder": 2,
        "variants": [{                 // Price variants (e.g., Small/Large)
          "id": "1",
          "label": "Small",
          "price": 9.95,
          "isDefault": true,
          "isAvailable": true,
          "sortOrder": 0
        }, {
          "id": "2",
          "label": "Large",
          "price": 14.95,
          "isDefault": false,
          "isAvailable": true,
          "sortOrder": 1
        }]
      }]
    }]
  }
}
=======================================================================================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"MENU_NOT_FOUND"
"SERVER_ERROR"
=======================================================================================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('get_menu');

router.post('/get_menu', async (req, res) => {
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

    // Fetch menu with sections, items, and variants in a single query
    // Using LEFT JOINs to include menus even if they have no sections/items/variants
    // This avoids N+1 query problems by getting all data in one round trip
    const result = await query(
      `SELECT
        m.id as menu_id, m.name as menu_name, m.slug, m.description as menu_description,
        m.type, m.is_active, m.sort_order as menu_sort_order, m.pdf_url, m.image_url,
        m.event_start, m.event_end,
        s.id as section_id, s.name as section_name, s.description as section_description,
        s.sort_order as section_sort_order,
        i.id as item_id, i.name as item_name, i.description as item_description,
        i.price, i.price_note, i.dietary_tags, i.is_available, i.sort_order as item_sort_order,
        v.id as variant_id, v.label as variant_label, v.price as variant_price,
        v.is_default as variant_is_default, v.is_available as variant_is_available,
        v.sort_order as variant_sort_order
       FROM menus m
       LEFT JOIN menu_sections s ON s.menu_id = m.id
       LEFT JOIN menu_items i ON i.section_id = s.id
       LEFT JOIN menu_item_variants v ON v.item_id = i.id
       WHERE m.id = $1
       ORDER BY s.sort_order, i.sort_order, v.sort_order`,
      [menu_id]
    );

    // If no rows returned, the menu doesn't exist
    if (result.rows.length === 0) {
      logger.response('MENU_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'MENU_NOT_FOUND',
        message: 'Menu not found'
      });
    }

    // Build the menu object from the first row (menu data is same across all rows)
    const firstRow = result.rows[0];
    const menu = {
      id: firstRow.menu_id.toString(),
      name: firstRow.menu_name,
      slug: firstRow.slug,
      description: firstRow.menu_description || undefined,
      type: firstRow.type,
      isActive: firstRow.is_active,
      sortOrder: firstRow.menu_sort_order,
      pdfUrl: firstRow.pdf_url || undefined,
      imageUrl: firstRow.image_url || undefined,
      // Only include eventDateRange if both dates are present
      eventDateRange: firstRow.event_start && firstRow.event_end ? {
        start: firstRow.event_start.toISOString().split('T')[0],
        end: firstRow.event_end.toISOString().split('T')[0]
      } : undefined,
      sections: []
    };

    // Use Maps to efficiently build the nested structure without duplicates
    // This handles the one-to-many relationships from the flattened SQL result
    const sectionsMap = new Map();
    const itemsMap = new Map();

    // Process each row from the query result
    for (const row of result.rows) {
      // Skip rows without a section (menu has no sections yet)
      if (!row.section_id) continue;

      // Create section if we haven't seen it before
      if (!sectionsMap.has(row.section_id)) {
        sectionsMap.set(row.section_id, {
          id: row.section_id.toString(),
          name: row.section_name,
          description: row.section_description || undefined,
          sortOrder: row.section_sort_order,
          items: []
        });
      }

      const section = sectionsMap.get(row.section_id);

      // Skip rows without an item (section has no items yet)
      if (!row.item_id) continue;

      // Create item if we haven't seen it before
      // Using a composite key of section_id + item_id to handle items correctly
      const itemKey = `${row.section_id}-${row.item_id}`;
      if (!itemsMap.has(itemKey)) {
        const item = {
          id: row.item_id.toString(),
          name: row.item_name,
          description: row.item_description || undefined,
          price: row.price ? parseFloat(row.price) : undefined,
          priceNote: row.price_note || undefined,
          dietaryTags: row.dietary_tags || undefined,
          isAvailable: row.is_available,
          sortOrder: row.item_sort_order,
          variants: []
        };
        itemsMap.set(itemKey, item);
        section.items.push(item);
      }

      // Add variant to the item if present
      // Variants are optional - an item might have a single price instead
      if (row.variant_id) {
        const item = itemsMap.get(itemKey);
        // Check we haven't already added this variant (shouldn't happen, but safety check)
        const variantExists = item.variants.some(v => v.id === row.variant_id.toString());
        if (!variantExists) {
          item.variants.push({
            id: row.variant_id.toString(),
            label: row.variant_label,
            price: parseFloat(row.variant_price),
            isDefault: row.variant_is_default,
            isAvailable: row.variant_is_available,
            sortOrder: row.variant_sort_order
          });
        }
      }
    }

    // Convert the Map values to the sections array
    menu.sections = Array.from(sectionsMap.values());

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      menu
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while fetching menu'
    });
  }
});

module.exports = router;
