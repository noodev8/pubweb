/*
=======================================================================
API Route: get_venue
=======================================================================
Method: POST
Purpose: Returns venue information including address, contact, social links, and awards.
=======================================================================
Request Payload:
{
  "venue_id": 1                        // integer, required
}

Success Response:
{
  "return_code": "SUCCESS",
  "venue": {
    "id": "1",
    "name": "The Nags Head Inn",
    "tagline": "A traditional country inn...",
    "description": "...",
    "address": {
      "line1": "Garthmyl",
      "line2": null,
      "town": "Montgomery",
      "county": "Powys",
      "postcode": "SY15 6RS",
      "country": "United Kingdom"
    },
    "contact": {
      "phone": "01686 640600",
      "email": "info@nagsheadgarthmyl.co.uk",
      "bookingEmail": "bookings@nagsheadgarthmyl.co.uk"
    },
    "social": {
      "facebook": "https://facebook.com/nagsheadgarthmyl",
      "instagram": "https://instagram.com/nagsheadgarthmyl",
      "twitter": null,
      "tripadvisor": "https://tripadvisor.com/..."
    },
    "awards": [
      {
        "name": "AA Rosette",
        "body": "AA",
        "rating": "1 Rosette",
        "year": 2024
      }
    ]
  }
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

router.post('/get_venue', async (req, res) => {

  try {
    const { venue_id } = req.body;

    // Validate required fields
    if (!venue_id) {
      return res.json({
        return_code: 'MISSING_FIELDS',
        message: 'venue_id is required'
      });
    }

    // Fetch venue
    const venueResult = await query(
      `SELECT id, name, tagline, description,
              address_line1, address_line2, town, county, postcode, country,
              phone, email, booking_email,
              facebook, instagram, twitter, tripadvisor
       FROM venues WHERE id = $1`,
      [venue_id]
    );

    if (venueResult.rows.length === 0) {
      return res.json({
        return_code: 'VENUE_NOT_FOUND',
        message: 'Venue not found'
      });
    }

    const v = venueResult.rows[0];

    // Fetch awards for this venue
    const awardsResult = await query(
      `SELECT name, body, rating, year
       FROM awards WHERE venue_id = $1 AND entity_type = 'venue'`,
      [venue_id]
    );

    // Format response to match TypeScript types
    const venue = {
      id: v.id.toString(),
      name: v.name,
      tagline: v.tagline || undefined,
      description: v.description,
      address: {
        line1: v.address_line1,
        line2: v.address_line2 || undefined,
        town: v.town,
        county: v.county || undefined,
        postcode: v.postcode,
        country: v.country
      },
      contact: {
        phone: v.phone,
        email: v.email,
        bookingEmail: v.booking_email || undefined
      },
      social: {
        facebook: v.facebook || undefined,
        instagram: v.instagram || undefined,
        twitter: v.twitter || undefined,
        tripadvisor: v.tripadvisor || undefined
      },
      awards: awardsResult.rows.length > 0 ? awardsResult.rows.map(a => ({
        name: a.name,
        body: a.body,
        rating: a.rating || undefined,
        year: a.year || undefined
      })) : undefined
    };

    return res.json({
      return_code: 'SUCCESS',
      venue
    });

  } catch (error) {
    console.error('get_venue error:', error);
    return res.json({
      return_code: 'SERVER_ERROR',
      message: 'An error occurred while fetching venue'
    });
  }
});

module.exports = router;
