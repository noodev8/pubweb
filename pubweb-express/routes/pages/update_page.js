/*
=======================================================================
API Route: update_page
=======================================================================
Method: POST
Purpose: Updates page content and sections. Requires authentication.
         Creates page if it doesn't exist. Replaces all sections.
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "page": "restaurant",                // string, required
  "title": "Our Restaurant",           // string, optional
  "subtitle": "AA Rosette Dining",     // string, optional
  "sections": [                        // array, optional - replaces all sections
    {
      "title": "The Experience",
      "content": "Enjoy locally sourced...",
      "image": null,
      "layout": "text-only",
      "sortOrder": 1
    }
  ]
}

Success Response:
{
  "return_code": "SUCCESS",
  "message": "Page updated successfully"
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"UNAUTHORIZED"
"FORBIDDEN"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { verifyToken } = require('../../middleware/auth');
const { withTransaction } = require('../../utils/transaction');


router.post('/update_page', verifyToken, async (req, res) => {

  try {
    const { venue_id, page, title, subtitle, sections } = req.body;

    // Validate required fields
    if (!venue_id || !page) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id and page are required'
      });
    }

    // Check user has access
    if (req.user.venue_id !== venue_id) {
      return res.json({
        return_code: 'FORBIDDEN',
        message: 'You do not have access to this venue'
      });
    }

    // Check venue exists
    const venueCheck = await query('SELECT id FROM venues WHERE id = $1', [venue_id]);
    if (venueCheck.rows.length === 0) {
      return res.json({
        return_code: 'VENUE_NOT_FOUND',
        message: 'Venue not found'
      });
    }

    await withTransaction(async (client) => {
      // Check if page exists
      const pageCheck = await client.query(
        'SELECT id FROM page_content WHERE venue_id = $1 AND page = $2',
        [venue_id, page]
      );

      let pageId;

      if (pageCheck.rows.length === 0) {
        // Create new page
        const insertResult = await client.query(
          `INSERT INTO page_content (venue_id, page, title, subtitle)
           VALUES ($1, $2, $3, $4)
           RETURNING id`,
          [venue_id, page, title || null, subtitle || null]
        );
        pageId = insertResult.rows[0].id;
      } else {
        pageId = pageCheck.rows[0].id;

        // Update page metadata if provided
        if (title !== undefined || subtitle !== undefined) {
          const updates = [];
          const values = [];
          let paramIndex = 1;

          if (title !== undefined) {
            updates.push(`title = $${paramIndex++}`);
            values.push(title);
          }
          if (subtitle !== undefined) {
            updates.push(`subtitle = $${paramIndex++}`);
            values.push(subtitle);
          }

          if (updates.length > 0) {
            values.push(pageId);
            await client.query(
              `UPDATE page_content SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
              values
            );
          }
        }
      }

      // Update sections if provided
      if (sections && Array.isArray(sections)) {
        // Delete existing sections
        await client.query('DELETE FROM page_sections WHERE page_content_id = $1', [pageId]);

        // Insert new sections
        for (const section of sections) {
          await client.query(
            `INSERT INTO page_sections (page_content_id, title, content, image, layout, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [
              pageId,
              section.title || null,
              section.content,
              section.image || null,
              section.layout || 'text-only',
              section.sortOrder || 0
            ]
          );
        }
      }
    });

    return res.json({
      return_code: 'SUCCESS',
      message: 'Page updated successfully'
    });

  } catch (error) {
    console.error('update_page error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while updating page'
    });
  }
});

module.exports = router;
