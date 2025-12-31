/*
=======================================================================================================================================
API Route: get_menus
=======================================================================================================================================
Method: POST
Purpose: Returns all menus for a venue with their sections, items, and price variants.
=======================================================================================================================================
Request Payload:
{
  "venue_id": 1                        // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "menus": [
    {
      "id": "1",
      "name": "Lunch Menu",
      "slug": "lunch",
      "description": "Available 12-3pm",
      "type": "regular",
      "isActive": true,
      "sortOrder": 1,
      "pdfUrl": null,
      "imageUrl": null,
      "eventDateRange": null,
      "sections": [
        {
          "id": "1",
          "name": "Starters",
          "description": null,
          "sortOrder": 1,
          "items": [
            {
              "id": "1",
              "name": "Soup of the Day",
              "description": "Served with crusty bread",
              "price": 6.50,
              "priceNote": null,
              "dietaryTags": ["vegetarian"],
              "isAvailable": true,
              "sortOrder": 1,
              "variants": []
            },
            {
              "id": "2",
              "name": "Fish & Chips",
              "description": "Beer-battered cod",
              "price": null,
              "dietaryTags": [],
              "isAvailable": true,
              "sortOrder": 2,
              "variants": [
                { "id": "1", "label": "Small", "price": 9.95, "isDefault": true, "isAvailable": true, "sortOrder": 0 },
                { "id": "2", "label": "Large", "price": 14.95, "isDefault": false, "isAvailable": true, "sortOrder": 1 }
              ]
            }
          ]
        }
      ]
    }
  ]
}
=======================================================================================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"SERVER_ERROR"
=======================================================================================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('get_menus');

router.post('/get_menus', async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { venue_id } = req.body;

    // Validate required fields
    if (!venue_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id is required'
      });
    }

    // Check venue exists
    const venueCheck = await query('SELECT id FROM venues WHERE id = $1', [venue_id]);
    if (venueCheck.rows.length === 0) {
      logger.response('VENUE_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'VENUE_NOT_FOUND',
        message: 'Venue not found'
      });
    }

    // Fetch all menus with sections, items, and variants using JOINs to avoid N+1
    // Single query fetches everything in one round trip to the database
    const menusResult = await query(
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
       WHERE m.venue_id = $1
       ORDER BY m.sort_order, s.sort_order, i.sort_order, v.sort_order`,
      [venue_id]
    );

    // Transform flat result into nested structure
    // Using Maps to efficiently build the hierarchy without duplicates
    const menusMap = new Map();
    const itemsMap = new Map(); // Track items globally to add variants

    for (const row of menusResult.rows) {
      // Get or create menu
      if (!menusMap.has(row.menu_id)) {
        menusMap.set(row.menu_id, {
          id: row.menu_id.toString(),
          name: row.menu_name,
          slug: row.slug,
          description: row.menu_description || undefined,
          type: row.type,
          isActive: row.is_active,
          sortOrder: row.menu_sort_order,
          pdfUrl: row.pdf_url || undefined,
          imageUrl: row.image_url || undefined,
          eventDateRange: row.event_start && row.event_end ? {
            start: row.event_start.toISOString().split('T')[0],
            end: row.event_end.toISOString().split('T')[0]
          } : undefined,
          sections: []
        });
      }

      const menu = menusMap.get(row.menu_id);

      // Skip if no section (menu has no sections yet)
      if (!row.section_id) continue;

      // Add section if not already added
      let section = menu.sections.find(s => s.id === row.section_id.toString());
      if (!section) {
        section = {
          id: row.section_id.toString(),
          name: row.section_name,
          description: row.section_description || undefined,
          sortOrder: row.section_sort_order,
          items: []
        };
        menu.sections.push(section);
      }

      // Skip if no item (section has no items yet)
      if (!row.item_id) continue;

      // Add item if not already added
      // Use global key to track items across all processing
      const itemKey = `${row.menu_id}-${row.section_id}-${row.item_id}`;
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
      if (row.variant_id) {
        const item = itemsMap.get(itemKey);
        // Check we haven't already added this variant
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

    const menus = Array.from(menusMap.values());

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      menus
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while fetching menus'
    });
  }
});

module.exports = router;
