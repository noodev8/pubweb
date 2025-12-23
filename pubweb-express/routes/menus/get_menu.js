/*
=======================================================================
API Route: get_menu
=======================================================================
Method: POST
Purpose: Returns a single menu by ID with its sections and items.
=======================================================================
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
    ...
  }
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"MENU_NOT_FOUND"
"SERVER_ERROR"
=======================================================================
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

    // Fetch menu with sections and items
    const result = await query(
      `SELECT
        m.id as menu_id, m.name as menu_name, m.slug, m.description as menu_description,
        m.type, m.is_active, m.sort_order as menu_sort_order, m.pdf_url, m.image_url,
        m.event_start, m.event_end,
        s.id as section_id, s.name as section_name, s.description as section_description,
        s.sort_order as section_sort_order,
        i.id as item_id, i.name as item_name, i.description as item_description,
        i.price, i.price_note, i.dietary_tags, i.is_available, i.sort_order as item_sort_order
       FROM menus m
       LEFT JOIN menu_sections s ON s.menu_id = m.id
       LEFT JOIN menu_items i ON i.section_id = s.id
       WHERE m.id = $1
       ORDER BY s.sort_order, i.sort_order`,
      [menu_id]
    );

    if (result.rows.length === 0) {
      logger.response('MENU_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'MENU_NOT_FOUND',
        message: 'Menu not found'
      });
    }

    // Build menu object from first row
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
      eventDateRange: firstRow.event_start && firstRow.event_end ? {
        start: firstRow.event_start.toISOString().split('T')[0],
        end: firstRow.event_end.toISOString().split('T')[0]
      } : undefined,
      sections: []
    };

    // Build sections and items
    const sectionsMap = new Map();

    for (const row of result.rows) {
      if (row.section_id) {
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

        if (row.item_id) {
          const existingItem = section.items.find(i => i.id === row.item_id.toString());
          if (!existingItem) {
            section.items.push({
              id: row.item_id.toString(),
              name: row.item_name,
              description: row.item_description || undefined,
              price: row.price ? parseFloat(row.price) : undefined,
              priceNote: row.price_note || undefined,
              dietaryTags: row.dietary_tags || undefined,
              isAvailable: row.is_available,
              sortOrder: row.item_sort_order
            });
          }
        }
      }
    }

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
