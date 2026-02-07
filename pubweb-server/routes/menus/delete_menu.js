/*
=======================================================================
API Route: delete_menu
=======================================================================
Method: POST
Purpose: Deletes a menu and all its sections and items. Requires authentication.
=======================================================================
Request Payload:
{
  "menu_id": 1                         // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Menu deleted successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"MENU_NOT_FOUND"
"UNAUTHORIZED"
"FORBIDDEN"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');
const { deleteImage } = require('../../utils/cloudinary');

router.post('/delete_menu', verifyToken, async (req, res) => {

  try {
    const { menu_id } = req.body;

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

    // Clean up menu_images from Cloudinary before deleting from database.
    // CASCADE delete will remove menu_images rows, so we need to fetch them first.
    // Delete failures are logged but don't block the menu deletion —
    // the cleanup script can catch any orphans later.
    const menuImages = await query(
      'SELECT cloudinary_public_id FROM menu_images WHERE menu_id = $1',
      [menu_id]
    );
    for (const img of menuImages.rows) {
      if (img.cloudinary_public_id) {
        // Only delete from Cloudinary if no other rows reference this asset
        const refCount = await query(
          'SELECT COUNT(*) as count FROM menu_images WHERE cloudinary_public_id = $1 AND menu_id != $2',
          [img.cloudinary_public_id, menu_id]
        );
        if (parseInt(refCount.rows[0].count, 10) === 0) {
          const result = await deleteImage(img.cloudinary_public_id);
          if (!result.success) {
            console.warn('Cloudinary delete warning (menu image):', result.error);
          }
        }
      }
    }

    // Delete menu (CASCADE will delete sections, items, and menu_images)
    await query('DELETE FROM menus WHERE id = $1', [menu_id]);

    return res.json({
      return_code: 'SUCCESS',
      message: 'Menu deleted successfully'
    });

  } catch (error) {
    console.error('delete_menu error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while deleting menu'
    });
  }
});

module.exports = router;
