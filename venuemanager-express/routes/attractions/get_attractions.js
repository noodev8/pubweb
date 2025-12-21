/*
=======================================================================
API Route: get_attractions
=======================================================================
Method: POST
Purpose: Returns all local attractions for a venue's Explore page.
=======================================================================
Request Payload:
{
  "venue_id": 1                        // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "attractions": [
    {
      "id": "1",
      "name": "Powis Castle",
      "description": "Medieval castle with beautiful gardens...",
      "category": "heritage",
      "distance": "8 miles",
      "websiteUrl": "https://nationaltrust.org.uk/powis-castle",
      "image": null
    }
  ]
}
=======================================================================
Return Codes:
"SUCCESS"
"MISSING_FIELDS"
"VENUE_NOT_FOUND"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('get_attractions');

router.post('/get_attractions', async (req, res) => {
  const start = Date.now();
  logger.request(req.body);

  try {
    const { venue_id } = req.body;

    // Validate required fields
    if (!venue_id) {
      logger.response('MISSING_FIELDS', Date.now() - start);
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id is required'
      });
    }

    // Check venue exists
    const venueCheck = await query('SELECT id FROM venues WHERE id = $1', [venue_id]);
    if (venueCheck.rows.length === 0) {
      logger.response('VENUE_NOT_FOUND', Date.now() - start);
      return res.json({
        return_code: 'VENUE_NOT_FOUND',
        message: 'Venue not found'
      });
    }

    // Fetch attractions
    const result = await query(
      `SELECT id, name, description, category, distance, website_url, image
       FROM attractions WHERE venue_id = $1
       ORDER BY category, name`,
      [venue_id]
    );

    const attractions = result.rows.map(a => ({
      id: a.id.toString(),
      name: a.name,
      description: a.description,
      category: a.category,
      distance: a.distance || undefined,
      websiteUrl: a.website_url || undefined,
      image: a.image || undefined
    }));

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      attractions
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while fetching attractions'
    });
  }
});

module.exports = router;
