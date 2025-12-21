/*
=======================================================================
API Route: update_section
=======================================================================
Method: POST
Purpose: Updates a menu section. Requires authentication.
=======================================================================
Request Payload:
{
  "section_id": 1,                     // integer, required
  "name": "Starters",                  // string, optional
  "description": "To share or solo",   // string, optional
  "sortOrder": 1                       // integer, optional
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Section updated successfully"
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

const logger = createRouteLogger('update_section');

router.post('/update_section', verifyToken, async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { section_id, name, description, sortOrder } = req.body;

    // Validate required fields
    if (!section_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'section_id is required'
      });
    }

    // Check section exists and get venue_id through menu
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

    // Check user has access to this venue
    if (req.user.venue_id !== section.venue_id) {
      logger.response('FORBIDDEN', Date.now() - start);
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this section'
      });
    }

    // Build update query
    const updates = [];
    const values = [];
    let paramIndex = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`);
      values.push(name);
    }
    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`);
      values.push(description);
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

    values.push(section_id);

    await query(
      `UPDATE menu_sections SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      values
    );

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      message: 'Section updated successfully'
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating section'
    });
  }
});

module.exports = router;
