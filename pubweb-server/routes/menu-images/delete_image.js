/*
=======================================================================
API Route: delete_image (menu images)
=======================================================================
Method: POST
Purpose: Deletes a menu image from DB and Cloudinary. Requires authentication.
=======================================================================
Request Payload:
{
  "image_id": 1                        // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Menu image deleted successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"FORBIDDEN"
"IMAGE_NOT_FOUND"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');
const { deleteImage } = require('../../utils/cloudinary');


router.post('/delete_image', verifyToken, async (req, res) => {

  try {
    const { image_id } = req.body;

    // Validate required fields
    if (!image_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'image_id is required'
      });
    }

    // Check image exists and get menu's venue_id
    const imageCheck = await query(
      `SELECT mi.id, mi.cloudinary_public_id, m.venue_id
       FROM menu_images mi
       JOIN menus m ON m.id = mi.menu_id
       WHERE mi.id = $1`,
      [image_id]
    );
    if (imageCheck.rows.length === 0) {
      return res.json({
        return_code: 'IMAGE_NOT_FOUND',
        message: 'Menu image not found'
      });
    }

    const image = imageCheck.rows[0];

    // Check user has access
    if (req.user.venue_id !== image.venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this image'
      });
    }

    // Delete from database
    await query('DELETE FROM menu_images WHERE id = $1', [image_id]);

    // Only delete from Cloudinary if no other rows reference the same asset
    const refCount = await query(
      'SELECT COUNT(*) as count FROM menu_images WHERE cloudinary_public_id = $1',
      [image.cloudinary_public_id]
    );
    if (parseInt(refCount.rows[0].count, 10) === 0) {
      const cloudinaryResult = await deleteImage(image.cloudinary_public_id);
      if (!cloudinaryResult.success) {
        console.warn('Cloudinary delete warning (menu image):', cloudinaryResult.error);
      }
    }

    return res.json({
      return_code: 'SUCCESS',
      message: 'Menu image deleted successfully'
    });

  } catch (error) {
    console.error('menu delete_image error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while deleting menu image'
    });
  }
});

module.exports = router;
