/*
=======================================================================
API Route: replace_image
=======================================================================
Method: POST
Purpose: Replaces a gallery image (deletes old from Cloudinary, updates DB).
         Requires authentication.
=======================================================================
Request Payload:
{
  "image_id": 1,                       // integer, required
  "image_url": "https://...",          // string, required (new image URL)
  "cloudinary_public_id": "pubweb/..." // string, required (new public_id)
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Image replaced successfully"
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


router.post('/replace_image', verifyToken, async (req, res) => {

  try {
    const { image_id, image_url, cloudinary_public_id } = req.body;

    // Validate required fields
    if (!image_id || !image_url || !cloudinary_public_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'image_id, image_url, and cloudinary_public_id are required'
      });
    }

    // Check image exists and get venue_id and old cloudinary_public_id
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

    // Delete old image from Cloudinary
    const cloudinaryResult = await deleteImage(image.cloudinary_public_id);
    if (!cloudinaryResult.success) {
      console.warn('Cloudinary delete warning:', cloudinaryResult.error);
      // Continue with update even if old image delete fails
    }

    // Update database with new image
    await query(
      `UPDATE gallery_images
       SET image_url = $1, cloudinary_public_id = $2
       WHERE id = $3`,
      [image_url, cloudinary_public_id, image_id]
    );

    return res.json({
      return_code: 'SUCCESS',
      message: 'Image replaced successfully'
    });

  } catch (error) {
    console.error('replace_image error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while replacing image'
    });
  }
});

module.exports = router;
