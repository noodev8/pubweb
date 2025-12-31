/*
=======================================================================================================================================
API Logger Utility
=======================================================================================================================================
Purpose: Logs API endpoint calls when CHECK_API_CALL environment variable is set to YES
Usage: Call logger.request() at the start of any API route - only logs when enabled
=======================================================================================================================================
*/

/**
 * Create a logger for a specific route
 * Only logs when CHECK_API_CALL=YES in environment
 * @param {string} routeName - The name of the route
 * @returns {Object} Logger object with request, response, and error methods
 */
function createRouteLogger(routeName) {
  const isEnabled = process.env.CHECK_API_CALL === 'YES';

  return {
    request: (payload) => {
      if (isEnabled) {
        const timestamp = new Date().toLocaleString();
        console.log(`[API] ${routeName} - Request - ${timestamp}`);
      }
    },
    response: (returnCode, duration) => {
      if (isEnabled) {
        console.log(`[API] ${routeName} - Response: ${returnCode} (${duration}ms)`);
      }
    },
    error: (error) => {
      // Always log errors regardless of CHECK_API_CALL setting
      console.error(`[API] ${routeName} - Error:`, error.message);
      if (process.env.NODE_ENV !== 'production') {
        console.error(error.stack);
      }
    }
  };
}

module.exports = {
  createRouteLogger
};
