/*
=======================================================================
API Route: get_page
=======================================================================
Method: POST
Purpose: Returns content for a specific page (About, Restaurant, etc.)
=======================================================================
Request Payload:
{
  "venue_id": 1,                       // integer, required
  "page": "restaurant"                 // string, required (page slug)
}

Success Response:
{
  "return_code": "SUCCESS",
  "pageContent": {
    "id": "1",
    "page": "restaurant",
    "title": "Our Restaurant",
    "subtitle": "AA Rosette Dining",
    "sections": [
      {
        "id": "1",
        "title": "The Experience",
        "content": "Enjoy locally sourced...",
        "image": null,
        "layout": "text-only",
        "sortOrder": 1
      }
    ]
  }
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"PAGE_NOT_FOUND"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');


router.post('/get_page', async (req, res) => {

  try {
    const { venue_id, page } = req.body;

    // Validate required fields
    if (!venue_id || !page) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id and page are required'
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

    // Fetch page content
    const pageResult = await query(
      `SELECT id, page, title, subtitle
       FROM page_content WHERE venue_id = $1 AND page = $2`,
      [venue_id, page]
    );

    if (pageResult.rows.length === 0) {
      return res.json({
        return_code: 'PAGE_NOT_FOUND',
        message: 'Page content not found'
      });
    }

    const pageData = pageResult.rows[0];

    // Fetch sections
    const sectionsResult = await query(
      `SELECT id, title, content, image, layout, sort_order
       FROM page_sections WHERE page_content_id = $1
       ORDER BY sort_order`,
      [pageData.id]
    );

    const pageContent = {
      id: pageData.id.toString(),
      page: pageData.page,
      title: pageData.title || undefined,
      subtitle: pageData.subtitle || undefined,
      sections: sectionsResult.rows.map(s => ({
        id: s.id.toString(),
        title: s.title || undefined,
        content: s.content,
        image: s.image || undefined,
        layout: s.layout || 'text-only',
        sortOrder: s.sort_order
      }))
    };

    return res.json({
      return_code: 'SUCCESS',
      pageContent
    });

  } catch (error) {
    console.error('get_page error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while fetching page'
    });
  }
});

module.exports = router;
