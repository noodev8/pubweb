const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');

router.post('/deploy_venue', verifyToken, async (req, res) => {
  try {
    // Get deploy hook URL for this venue
    const result = await query(
      'SELECT deploy_hook_url FROM venues WHERE id = $1',
      [req.user.venue_id]
    );

    if (result.rows.length === 0) {
      return res.json({
        return_code: 'VENUE_NOT_FOUND',
        message: 'Venue not found',
      });
    }

    const { deploy_hook_url } = result.rows[0];

    if (!deploy_hook_url) {
      return res.json({
        return_code: 'NO_DEPLOY_HOOK',
        message: 'Deploy hook not configured for this venue',
      });
    }

    // Trigger Vercel deploy
    const response = await fetch(deploy_hook_url, { method: 'POST' });

    if (!response.ok) {
      return res.json({
        return_code: 'DEPLOY_FAILED',
        message: 'Failed to trigger deployment',
      });
    }

    // Clear unpublished flag
    await query(
      'UPDATE venues SET has_unpublished_changes = false WHERE id = $1',
      [req.user.venue_id]
    );

    return res.json({
      return_code: 'SUCCESS',
    });
  } catch (error) {
    console.error('Error deploying venue:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'Failed to deploy venue',
    });
  }
});

module.exports = router;
