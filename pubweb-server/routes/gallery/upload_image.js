/*
=======================================================================
API Route: upload_image
=======================================================================
Method: POST
Purpose: Adds a new gallery image. Requires authentication.
         Enforces 9 image limit per venue.
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "image_url": "https://...",          // string, required
  "cloudinary_public_id": "pubweb/...",// string, required
  "caption": "Optional caption"        // string, optional (max 150 chars)
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
"SLOT_LIMIT_REACHED"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');

const MAX_GALLERY_IMAGES = 9;


router.post('/upload_image', verifyToken, async (req, res) => {

  try {
    const { venue_id, image_url, cloudinary_public_id, caption } = req.body;

    // Validate required fields
    if (!venue_id || !image_url || !cloudinary_public_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id, image_url, and cloudinary_public_id are required'
      });
    }

    // Check user has access
    if (req.user.venue_id !== venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this venue'
      });
    }

    // Check current image count
    const countResult = await query(
      'SELECT COUNT(*) as count FROM gallery_images WHERE venue_id = $1',
      [venue_id]
    );
    const currentCount = parseInt(countResult.rows[0].count, 10);

    if (currentCount >= MAX_GALLERY_IMAGES) {
      return res.json({
        return_code: 'SLOT_LIMIT_REACHED',
        message: `Maximum of ${MAX_GALLERY_IMAGES} gallery images allowed`
      });
    }

    // Get next sort order
    const sortResult = await query(
      'SELECT COALESCE(MAX(sort_order), -1) + 1 as next_order FROM gallery_images WHERE venue_id = $1',
      [venue_id]
    );
    const nextSortOrder = sortResult.rows[0].next_order;

    // Insert the image
    const result = await query(
      `INSERT INTO gallery_images (venue_id, image_url, cloudinary_public_id, caption, sort_order)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [venue_id, image_url, cloudinary_public_id, caption?.slice(0, 150) || null, nextSortOrder]
    );

    return res.json({
      return_code: 'SUCCESS',
      image_id: result.rows[0].id,
      sortOrder: nextSortOrder
    });

  } catch (error) {
    console.error('upload_image error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while uploading image'
    });
  }
});

module.exports = router;
