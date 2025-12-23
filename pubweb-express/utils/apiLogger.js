/*
=======================================================================
API Logger Utility
=======================================================================
Logging utility for API routes.
Use this to log requests, responses, and timing information.
=======================================================================
*/

/**
 * Log an API request
 * @param {string} route - The route name
 * @param {Object} payload - The request payload (sanitized)
 */
function logRequest(route, payload) {
  console.log(`[API] ${route} - Request:`, JSON.stringify(sanitizePayload(payload)));
}

/**
 * Log an API response
 * @param {string} route - The route name
 * @param {string} returnCode - The return code
 * @param {number} duration - Request duration in ms
 */
function logResponse(route, returnCode, duration) {
  console.log(`[API] ${route} - Response: ${returnCode} (${duration}ms)`);
}

/**
 * Log an API error
 * @param {string} route - The route name
 * @param {Error} error - The error object
 */
function logError(route, error) {
  console.error(`[API] ${route} - Error:`, error.message);
  if (process.env.NODE_ENV !== 'production') {
    console.error(error.stack);
  }
}

/**
 * Remove sensitive fields from payload for logging
 * @param {Object} payload - The original payload
 * @returns {Object} Sanitized payload
 */
function sanitizePayload(payload) {
  if (!payload) return {};

  const sanitized = { ...payload };
  const sensitiveFields = ['password', 'password_hash', 'token', 'secret'];

  for (const field of sensitiveFields) {
    if (sanitized[field]) {
      sanitized[field] = '[REDACTED]';
    }
  }

  return sanitized;
}

/**
 * Create a logger for a specific route
 * @param {string} routeName - The name of the route
 * @returns {Object} Logger object with request, response, and error methods
 */
function createRouteLogger(routeName) {
  return {
    request: (payload) => logRequest(routeName, payload),
    response: (returnCode, duration) => logResponse(routeName, returnCode, duration),
    error: (error) => logError(routeName, error)
  };
}

module.exports = {
  logRequest,
  logResponse,
  logError,
  createRouteLogger
};
