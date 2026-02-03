/*
=======================================================================
API Route: reorder_gallery
=======================================================================
Method: POST
Purpose: Bulk updates sort_order for gallery images. Requires authentication.
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "order": [                           // array of {id, sortOrder}
    { "id": 3, "sortOrder": 0 },
    { "id": 1, "sortOrder": 1 },
    { "id": 2, "sortOrder": 2 }
  ]
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Gallery reordered successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"FORBIDDEN"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');


router.post('/reorder_gallery', verifyToken, async (req, res) => {

  try {
    const { venue_id, order } = req.body;

    // Validate required fields
    if (!venue_id || !order || !Array.isArray(order)) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id and order array are required'
      });
    }

    // Check user has access
    if (req.user.venue_id !== venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this venue'
      });
    }

    // Update sort_order for each image
    for (const item of order) {
      if (item.id && typeof item.sortOrder === 'number') {
        await query(
          `UPDATE gallery_images
           SET sort_order = $1
           WHERE id = $2 AND venue_id = $3`,
          [item.sortOrder, item.id, venue_id]
        );
      }
    }

    return res.json({
      return_code: 'SUCCESS',
      message: 'Gallery reordered successfully'
    });

  } catch (error) {
    console.error('reorder_gallery error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while reordering gallery'
    });
  }
});

module.exports = router;
