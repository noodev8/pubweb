/*
=======================================================================
API Route: delete_room
=======================================================================
Method: POST
Purpose: Deletes a room. Requires authentication.
=======================================================================
Request Payload:
{
  "room_id": 1                         // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Room deleted successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"ROOM_NOT_FOUND"
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

const logger = createRouteLogger('delete_room');

router.post('/delete_room', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { room_id } = req.body;

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

    // Delete room
    await query('DELETE FROM rooms WHERE id = $1', [room_id]);

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Room deleted successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while deleting room'
    });
  }
});

module.exports = router;
