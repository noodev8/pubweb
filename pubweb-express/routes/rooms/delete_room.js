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


router.post('/delete_room', verifyToken, async (req, res) => {

  try {
    const { room_id } = req.body;

    // Validate required fields
    if (!room_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'room_id is required'
      });
    }

    // Check room exists and get venue_id
    const roomCheck = await query('SELECT id, venue_id FROM rooms WHERE id = $1', [room_id]);
    if (roomCheck.rows.length === 0) {
      return res.json({
        return_code: 'ROOM_NOT_FOUND',
        message: 'Room not found'
      });
    }

    const room = roomCheck.rows[0];

    // Check user has access
    if (req.user.venue_id !== room.venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this room'
      });
    }

    // Delete room
    await query('DELETE FROM rooms WHERE id = $1', [room_id]);

    return res.json({
      return_code: 'SUCCESS',
      message: 'Room deleted successfully'
    });

  } catch (error) {
    console.error('delete_room error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while deleting room'
    });
  }
});

module.exports = router;
