/*
=======================================================================
API Route: get_gallery
=======================================================================
Method: POST
Purpose: Returns all gallery images for a venue, ordered by sort_order.
         Public endpoint (no auth required).
=======================================================================
Request Payload:
{
  "venue_id": 1                        // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "images": [
    {
      "id": "1",
      "imageUrl": "https://res.cloudinary.com/...",
      "cloudinaryPublicId": "pubweb/gallery/abc123",
      "caption": "Mother's Day Special",
      "sortOrder": 0
    }
  ]
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');


router.post('/get_gallery', async (req, res) => {

  try {
    const { venue_id } = req.body;

    // Validate required fields
    if (!venue_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id is required'
      });
    }

    // Check venue exists
    const venueCheck = await query('SELECT id FROM venues WHERE id = $1', [venue_id]);
    if (venueCheck.rows.length === 0) {
      return res.json({
        return_code: 'VENUE_NOT_FOUND',
        message: 'Venue not found'
      });
    }

    // Get all gallery images for venue
    const result = await query(
      `SELECT id, image_url, cloudinary_public_id, caption, sort_order
       FROM gallery_images
       WHERE venue_id = $1
       ORDER BY sort_order ASC, id ASC`,
      [venue_id]
    );

    const images = result.rows.map(row => ({
      id: String(row.id),
      imageUrl: row.image_url,
      cloudinaryPublicId: row.cloudinary_public_id,
      caption: row.caption || '',
      sortOrder: row.sort_order
    }));

    return res.json({
      return_code: 'SUCCESS',
      images
    });

  } catch (error) {
    console.error('get_gallery error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while fetching gallery'
    });
  }
});

module.exports = router;
