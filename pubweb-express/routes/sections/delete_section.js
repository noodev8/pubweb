/*
=======================================================================
API Route: delete_section
=======================================================================
Method: POST
Purpose: Deletes a menu section and all its items. Requires authentication.
=======================================================================
Request Payload:
{
  "section_id": 1                      // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Section deleted successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"SECTION_NOT_FOUND"
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

const logger = createRouteLogger('delete_section');

router.post('/delete_section', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { section_id } = req.body;

    // Validate required fields
    if (!section_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'section_id is required'
      });
    }

    // Check section exists and get venue_id
    const sectionCheck = await query(
      `SELECT s.id, m.venue_id
       FROM menu_sections s
       JOIN menus m ON m.id = s.menu_id
       WHERE s.id = $1`,
      [section_id]
    );

    if (sectionCheck.rows.length === 0) {
      logger.response('SECTION_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'SECTION_NOT_FOUND',
        message: 'Section not found'
      });
    }

    const section = sectionCheck.rows[0];

    // Check user has access
    if (req.user.venue_id !== section.venue_id) {
      logger.response('FORBIDDEN', Date.now() - start);
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this section'
      });
    }

    // Delete section (CASCADE will delete items)
    await query('DELETE FROM menu_sections WHERE id = $1', [section_id]);

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Section deleted successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while deleting section'
    });
  }
});

module.exports = router;
