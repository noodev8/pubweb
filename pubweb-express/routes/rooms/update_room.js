/*
=======================================================================
API Route: update_room
=======================================================================
Method: POST
Purpose: Updates a room. Requires authentication.
=======================================================================
Request Payload:
{
  "room_id": 1,                        // integer, required
  "name": "The Montgomery",            // string, optional
  "slug": "the-montgomery",            // string, optional
  "description": "A spacious...",      // string, optional
  "type": "double",                    // string, optional
  "sleeps": 2,                         // integer, optional
  "features": ["King bed"],            // array, optional
  "images": [],                        // array, optional
  "price": { "from": 120, "currency": "GBP" }, // object, optional
  "isAvailable": true,                 // boolean, optional
  "sortOrder": 1                       // integer, optional
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Room updated successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"ROOM_NOT_FOUND"
"SLUG_EXISTS"
"UNAUTHORIZED"
"FORBIDDEN"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('update_room');

router.post('/update_room', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const {
      room_id, name, slug, description, type, sleeps,
      features, images, price, isAvailable, sortOrder
    } = req.body;

    // Validate required fields
    if (!room_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'room_id is required'
      });
    }

    // Check room exists and get venue_id
    const roomCheck = await query('SELECT id, venue_id FROM rooms WHERE id = $1', [room_id]);
    if (roomCheck.rows.length === 0) {
      logger.response('ROOM_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'ROOM_NOT_FOUND',
        message: 'Room not found'
      });
    }

    const room = roomCheck.rows[0];

    // Check user has access
    if (req.user.venue_id !== room.venue_id) {
      logger.response('FORBIDDEN', Date.now() - start);
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this room'
      });
    }

    // Check slug if being updated
    if (slug !== undefined) {
      const slugCheck = await query(
        'SELECT id FROM rooms WHERE venue_id = $1 AND slug = $2 AND id != $3',
        [room.venue_id, slug, room_id]
      );
      if (slugCheck.rows.length > 0) {
        logger.response('SLUG_EXISTS', Date.now() - start);
        return res.json({
          return_code: 'SLUG_EXISTS',
          message: 'A room with this slug already exists'
        });
      }
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (slug !== undefined) {
      updates.push(`slug = $${paramIndex++}`);
      values.push(slug);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
    }
    if (type !== undefined) {
      updates.push(`type = $${paramIndex++}`);
      values.push(type);
    }
    if (sleeps !== undefined) {
      updates.push(`sleeps = $${paramIndex++}`);
      values.push(sleeps);
    }
    if (features !== undefined) {
      updates.push(`features = $${paramIndex++}`);
      values.push(features);
    }
    if (images !== undefined) {
      updates.push(`images = $${paramIndex++}`);
      values.push(images);
    }
    if (price !== undefined) {
      updates.push(`price_from = $${paramIndex++}`);
      values.push(price?.from || null);
      updates.push(`price_currency = $${paramIndex++}`);
      values.push(price?.currency || 'GBP');
    }
    if (isAvailable !== undefined) {
      updates.push(`is_available = $${paramIndex++}`);
      values.push(isAvailable);
    }
    if (sortOrder !== undefined) {
      updates.push(`sort_order = $${paramIndex++}`);
      values.push(sortOrder);
    }

    if (updates.length === 0) {
      logger.response('SUCCESS', Date.now() - start);
      return res.json({
        return_code: 'SUCCESS',
        message: 'No changes to update'
      });
    }

    values.push(room_id);

    await query(
      `UPDATE rooms SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Room updated successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating room'
    });
  }
});

module.exports = router;
