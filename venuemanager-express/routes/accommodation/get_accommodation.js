/*
=======================================================================
API Route: get_accommodation
=======================================================================
Method: POST
Purpose: Returns accommodation info and all rooms for a venue.
=======================================================================
Request Payload:
{
  "venue_id": 1                        // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "accommodation": {
    "id": "1",
    "description": "8 beautifully appointed en-suite rooms...",
    "features": ["Free WiFi", "En-suite bathrooms", "Breakfast included"],
    "bookingUrl": "https://eviivo.com/...",
    "bookingEmail": "bookings@nagshead.com",
    "awards": [
      { "name": "5 Star Rating", "body": "AA", "rating": "5 Star", "year": 2024 }
    ],
    "rooms": [
      {
        "id": "1",
        "name": "Room 1 - The Montgomery",
        "slug": "the-montgomery",
        "description": "A spacious double room...",
        "type": "double",
        "sleeps": 2,
        "features": ["King bed", "Valley views", "Roll-top bath"],
        "images": [],
        "price": { "from": 120, "currency": "GBP" },
        "isAvailable": true,
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
"NO_ACCOMMODATION"
"SERVER_ERROR"
=======================================================================
*/

const express = require('express');
const router = express.Router();
const { query } = require('../../database');
const { createRouteLogger } = require('../../utils/apiLogger');

const logger = createRouteLogger('get_accommodation');

router.post('/get_accommodation', async (req, res) => {
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

    // Fetch accommodation
    const accomResult = await query(
      `SELECT id, description, features, booking_url, booking_email
       FROM accommodation WHERE venue_id = $1`,
      [venue_id]
    );

    if (accomResult.rows.length === 0) {
      logger.response('NO_ACCOMMODATION', Date.now() - start);
      return res.json({
        return_code: 'NO_ACCOMMODATION',
        message: 'This venue does not have accommodation'
      });
    }

    const accom = accomResult.rows[0];

    // Fetch accommodation awards
    const awardsResult = await query(
      `SELECT name, body, rating, year
       FROM awards WHERE venue_id = $1 AND entity_type = 'accommodation'`,
      [venue_id]
    );

    // Fetch rooms
    const roomsResult = await query(
      `SELECT id, name, slug, description, type, sleeps, features, images,
              price_from, price_currency, is_available, sort_order
       FROM rooms WHERE venue_id = $1
       ORDER BY sort_order`,
      [venue_id]
    );

    // Format response
    const accommodation = {
      id: accom.id.toString(),
      description: accom.description,
      features: accom.features || [],
      bookingUrl: accom.booking_url || undefined,
      bookingEmail: accom.booking_email || undefined,
      awards: awardsResult.rows.length > 0 ? awardsResult.rows.map(a => ({
        name: a.name,
        body: a.body,
        rating: a.rating || undefined,
        year: a.year || undefined
      })) : undefined,
      rooms: roomsResult.rows.map(r => ({
        id: r.id.toString(),
        name: r.name,
        slug: r.slug,
        description: r.description,
        type: r.type,
        sleeps: r.sleeps,
        features: r.features || [],
        images: r.images || undefined,
        price: r.price_from ? {
          from: parseFloat(r.price_from),
          currency: r.price_currency
        } : undefined,
        isAvailable: r.is_available,
        sortOrder: r.sort_order
      }))
    };

    logger.response('SUCCESS', Date.now() - start);
    return res.json({
      return_code: 'SUCCESS',
      accommodation
    });

  } catch (error) {
    logger.error(error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while fetching accommodation'
    });
  }
});

module.exports = router;
