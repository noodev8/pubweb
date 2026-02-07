/*
=======================================================================
API Route: upload_image (menu images)
=======================================================================
Method: POST
Purpose: Adds a new menu page image. Requires authentication.
         Enforces 10 image limit per menu.
=======================================================================
Request Payload:
{
  "menu_id": 1,                       // integer, required
  "image_url": "https://...",          // string, required
  "cloudinary_public_id": "pubweb/..."// string, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "image_id": 1,
  "sortOrder": 0
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"FORBIDDEN"
"MENU_NOT_FOUND"
"SLOT_LIMIT_REACHED"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');

const MAX_MENU_IMAGES = 10;


router.post('/upload_image', verifyToken, async (req, res) => {

  try {
    const { menu_id, image_url, cloudinary_public_id } = req.body;

    // Validate required fields
    if (!menu_id || !image_url || !cloudinary_public_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'menu_id, image_url, and cloudinary_public_id are required'
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

    // Check current image count
    const countResult = await query(
      'SELECT COUNT(*) as count FROM menu_images WHERE menu_id = $1',
      [menu_id]
    );
    const currentCount = parseInt(countResult.rows[0].count, 10);

    if (currentCount >= MAX_MENU_IMAGES) {
      return res.json({
        return_code: 'SLOT_LIMIT_REACHED',
        message: `Maximum of ${MAX_MENU_IMAGES} menu images allowed`
      });
    }

    // Shift existing images down so the new image appears first
    await query(
      'UPDATE menu_images SET sort_order = sort_order + 1 WHERE menu_id = $1',
      [menu_id]
    );

    // Insert the new image at position 0
    const result = await query(
      `INSERT INTO menu_images (menu_id, image_url, cloudinary_public_id, sort_order)
       VALUES ($1, $2, $3, 0)
       RETURNING id`,
      [menu_id, image_url, cloudinary_public_id]
    );

    return res.json({
      return_code: 'SUCCESS',
      image_id: result.rows[0].id,
      sortOrder: 0
    });

  } catch (error) {
    console.error('menu upload_image error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while uploading menu image'
    });
  }
});

module.exports = router;
