/*
=======================================================================
API Route: update_menu
=======================================================================
Method: POST
Purpose: Updates a menu. Requires authentication.
=======================================================================
Request Payload:
{
  "menu_id": 1,                        // integer, required
  "name": "Lunch Menu",                // string, optional
  "slug": "lunch",                     // string, optional
  "description": "Available 12-3pm",   // string, optional
  "type": "regular",                   // string, optional
  "isActive": true,                    // boolean, optional
  "sortOrder": 1,                      // integer, optional
  "pdfUrl": "https://...",             // string, optional
  "imageUrl": "https://...",           // string, optional
  "eventDateRange": {                  // object, optional
    "start": "2024-12-24",
    "end": "2024-12-26"
  }
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Menu updated successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"MENU_NOT_FOUND"
"SLUG_EXISTS"
"UNAUTHORIZED"
"FORBIDDEN"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');

router.post('/update_menu', verifyToken, async (req, res) => {

  try {
    const {
      menu_id, name, slug, description, type,
      isActive, sortOrder, pdfUrl, imageUrl, eventDateRange
    } = req.body;

    // Validate required fields
    if (!menu_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'menu_id is required'
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

    // Check user has access to this venue
    if (req.user.venue_id !== menu.venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this menu'
      });
    }

    // If updating slug, check it doesn't conflict
    if (slug !== undefined) {
      const slugCheck = await query(
        'SELECT id FROM menus WHERE venue_id = $1 AND slug = $2 AND id != $3',
        [menu.venue_id, slug, menu_id]
      );
      if (slugCheck.rows.length > 0) {
        return res.json({
          return_code: 'SLUG_EXISTS',
          message: 'A menu with this slug already exists for this venue'
        });
      }
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (slug !== undefined) {
      updates.push(`slug = $${paramIndex++}`);
      values.push(slug);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (type !== undefined) {
      updates.push(`type = $${paramIndex++}`);
      values.push(type);
    }
    if (isActive !== undefined) {
      updates.push(`is_active = $${paramIndex++}`);
      values.push(isActive);
    }
    if (sortOrder !== undefined) {
      updates.push(`sort_order = $${paramIndex++}`);
      values.push(sortOrder);
    }
    if (pdfUrl !== undefined) {
      updates.push(`pdf_url = $${paramIndex++}`);
      values.push(pdfUrl);
    }
    if (imageUrl !== undefined) {
      updates.push(`image_url = $${paramIndex++}`);
      values.push(imageUrl);
    }
    if (eventDateRange !== undefined) {
      updates.push(`event_start = $${paramIndex++}`);
      values.push(eventDateRange?.start || null);
      updates.push(`event_end = $${paramIndex++}`);
      values.push(eventDateRange?.end || null);
    }

    // If no updates provided
    if (updates.length === 0) {
      return res.json({
        return_code: 'SUCCESS',
        message: 'No changes to update'
      });
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(menu_id);

    await query(
      `UPDATE menus SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    return res.json({
      return_code: 'SUCCESS',
      message: 'Menu updated successfully'
    });

  } catch (error) {
    console.error('update_menu error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating menu'
    });
  }
});

module.exports = router;
