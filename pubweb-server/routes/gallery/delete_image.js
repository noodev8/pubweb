/*
=======================================================================
API Route: delete_image
=======================================================================
Method: POST
Purpose: Deletes a gallery image from DB and Cloudinary. Requires authentication.
=======================================================================
Request Payload:
{
  "image_id": 1                        // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Image deleted successfully"
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

    // Check image exists and get venue_id and cloudinary_public_id
    const imageCheck = await query(
      'SELECT id, venue_id, cloudinary_public_id FROM gallery_images WHERE id = $1',
      [image_id]
    );
    if (imageCheck.rows.length === 0) {
      return res.json({
        return_code: 'IMAGE_NOT_FOUND',
        message: 'Image not found'
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

    // Delete from Cloudinary
    const cloudinaryResult = await deleteImage(image.cloudinary_public_id);
    if (!cloudinaryResult.success) {
      console.warn('Cloudinary delete warning:', cloudinaryResult.error);
      // Continue with DB delete even if Cloudinary fails
    }

    // Delete from database
    await query('DELETE FROM gallery_images WHERE id = $1', [image_id]);

    return res.json({
      return_code: 'SUCCESS',
      message: 'Image deleted successfully'
    });

  } catch (error) {
    console.error('delete_image error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while deleting image'
    });
  }
});

module.exports = router;
