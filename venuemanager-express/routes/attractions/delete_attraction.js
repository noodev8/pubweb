/*
=======================================================================
API Route: delete_attraction
=======================================================================
Method: POST
Purpose: Deletes an attraction. Requires authentication.
=======================================================================
Request Payload:
{
  "attraction_id": 1                   // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Attraction deleted successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"ATTRACTION_NOT_FOUND"
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

const logger = createRouteLogger('delete_attraction');

router.post('/delete_attraction', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { attraction_id } = req.body;

    // Validate required fields
    if (!attraction_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'attraction_id is required'
      });
    }

    // Check attraction exists and get venue_id
    const attractionCheck = await query(
      'SELECT id, venue_id FROM attractions WHERE id = $1',
      [attraction_id]
    );

    if (attractionCheck.rows.length === 0) {
      logger.response('ATTRACTION_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'ATTRACTION_NOT_FOUND',
        message: 'Attraction not found'
      });
    }

    const attraction = attractionCheck.rows[0];

    // Check user has access
    if (req.user.venue_id !== attraction.venue_id) {
      logger.response('FORBIDDEN', Date.now() - start);
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this attraction'
      });
    }

    // Delete attraction
    await query('DELETE FROM attractions WHERE id = $1', [attraction_id]);

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Attraction deleted successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while deleting attraction'
    });
  }
});

module.exports = router;
