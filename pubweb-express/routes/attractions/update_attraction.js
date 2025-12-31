/*
=======================================================================
API Route: update_attraction
=======================================================================
Method: POST
Purpose: Updates an attraction. Requires authentication.
=======================================================================
Request Payload:
{
  "attraction_id": 1,                  // integer, required
  "name": "Powis Castle",              // string, optional
  "description": "Medieval castle...", // string, optional
  "category": "heritage",              // string, optional
  "distance": "8 miles",               // string, optional
  "websiteUrl": "https://...",         // string, optional
  "image": "https://..."               // string, optional
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Attraction updated successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"ATTRACTION_NOT_FOUND"
"INVALID_CATEGORY"
"UNAUTHORIZED"
"FORBIDDEN"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');


const VALID_CATEGORIES = ['heritage', 'nature', 'activities', 'dining', 'shopping', 'transport'];

router.post('/update_attraction', verifyToken, async (req, res) => {

  try {
    const { attraction_id, name, description, category, distance, websiteUrl, image } = req.body;

    // Validate required fields
    if (!attraction_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'attraction_id is required'
      });
    }

    // Validate category if provided
    if (category !== undefined && !VALID_CATEGORIES.includes(category)) {
      return res.json({
        return_code: 'INVALID_CATEGORY',
        message: `Category must be one of: ${VALID_CATEGORIES.join(', ')}`
      });
    }

    // Check attraction exists and get venue_id
    const attractionCheck = await query(
      'SELECT id, venue_id FROM attractions WHERE id = $1',
      [attraction_id]
    );

    if (attractionCheck.rows.length === 0) {
      return res.json({
        return_code: 'ATTRACTION_NOT_FOUND',
        message: 'Attraction not found'
      });
    }

    const attraction = attractionCheck.rows[0];

    // Check user has access
    if (req.user.venue_id !== attraction.venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this attraction'
      });
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (category !== undefined) {
      updates.push(`category = $${paramIndex++}`);
      values.push(category);
    }
    if (distance !== undefined) {
      updates.push(`distance = $${paramIndex++}`);
      values.push(distance);
    }
    if (websiteUrl !== undefined) {
      updates.push(`website_url = $${paramIndex++}`);
      values.push(websiteUrl);
    }
    if (image !== undefined) {
      updates.push(`image = $${paramIndex++}`);
      values.push(image);
    }

    if (updates.length === 0) {
      return res.json({
        return_code: 'SUCCESS',
        message: 'No changes to update'
      });
    }

    values.push(attraction_id);

    await query(
      `UPDATE attractions SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    return res.json({
      return_code: 'SUCCESS',
      message: 'Attraction updated successfully'
    });

  } catch (error) {
    console.error('update_attraction error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating attraction'
    });
  }
});

module.exports = router;
