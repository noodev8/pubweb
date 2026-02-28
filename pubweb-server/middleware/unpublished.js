/*
  Unpublished Changes Middleware
  Automatically marks a venue as having unpublished changes
  when an authenticated user performs a mutating action.
*/

const { query } = require('../database');

// Paths that should NOT trigger the unpublished flag
const EXCLUDED_PATTERNS = [
  '/get_',
  '/login',
  '/deploy_venue',
  '/sign_upload',
  '/health',
  '/get_publish_status',
];

function isExcluded(path) {
  return EXCLUDED_PATTERNS.some((pattern) => path.includes(pattern));
}

function unpublishedMiddleware(req, res, next) {
  const originalJson = res.json.bind(res);

  res.json = function (body) {
    // Only flag on successful, authenticated, mutating requests
    if (
      body &&
      body.return_code === 'SUCCESS' &&
      req.user &&
      req.user.venue_id &&
      !isExcluded(req.path)
    ) {
      // Fire-and-forget: don't delay the response
      query('UPDATE venues SET has_unpublished_changes = true WHERE id = $1', [
        req.user.venue_id,
      ]).catch((err) => {
        console.error('Failed to set unpublished flag:', err.message);
      });
    }

    return originalJson(body);
  };

  next();
}

module.exports = unpublishedMiddleware;
