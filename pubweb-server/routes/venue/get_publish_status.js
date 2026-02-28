const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');

router.post('/get_publish_status', verifyToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT has_unpublished_changes FROM venues WHERE id = $1',
      [req.user.venue_id]
    );

    if (result.rows.length === 0) {
      return res.json({
        return_code: 'VENUE_NOT_FOUND',
        message: 'Venue not found',
      });
    }

    return res.json({
      return_code: 'SUCCESS',
      has_unpublished_changes: result.rows[0].has_unpublished_changes || false,
    });
  } catch (error) {
    console.error('Error getting publish status:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'Failed to get publish status',
    });
  }
});

module.exports = router;
