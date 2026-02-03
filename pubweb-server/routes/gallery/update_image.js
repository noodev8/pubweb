/*
=======================================================================
API Route: update_image
=======================================================================
Method: POST
Purpose: Updates a gallery image caption. Requires authentication.
=======================================================================
Request Payload:
{
  "image_id": 1,                       // integer, required
  "caption": "Updated caption"         // string, required (max 150 chars)
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Image updated successfully"
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


router.post('/update_image', verifyToken, async (req, res) => {

  try {
    const { image_id, caption } = req.body;

    // Validate required fields
    if (!image_id || caption === undefined) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'image_id and caption are required'
      });
    }

    // Check image exists and get venue_id
    const imageCheck = await query(
      'SELECT id, venue_id FROM gallery_images WHERE id = $1',
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

    // Update caption
    await query(
      'UPDATE gallery_images SET caption = $1 WHERE id = $2',
      [caption?.slice(0, 150) || null, image_id]
    );

    return res.json({
      return_code: 'SUCCESS',
      message: 'Image updated successfully'
    });

  } catch (error) {
    console.error('update_image error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating image'
    });
  }
});

module.exports = router;
