const axios = require('axios');
const env = require('../config/env');

const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place';

async function textSearch({ category, city, radius, pageToken }) {
  const params = {
    query: `${category} in ${city}`,
    key: env.google.placesApiKey,
    type: 'establishment',
  };
  if (radius) params.radius = radius * 1000; // km → m
  if (pageToken) params.pagetoken = pageToken;

  const { data } = await axios.get(`${PLACES_BASE}/textsearch/json`, { params });
  return data;
}

async function getPlaceDetails(placeId) {
  const { data } = await axios.get(`${PLACES_BASE}/details/json`, {
    params: {
      place_id: placeId,
      fields: 'name,formatted_address,formatted_phone_number,website,rating,user_ratings_total,geometry,url,photos,opening_hours',
      key: env.google.placesApiKey,
    },
  });
  return data.result;
}

async function searchBusinesses({ category, city, radius = 10, filters = {} }) {
  const results = [];
  let pageToken = null;
  let pages = 0;
  const maxPages = 3; // up to 60 results

  do {
    const data = await textSearch({ category, city, radius, pageToken });
    if (!data.results) break;

    for (const place of data.results) {
      const details = await getPlaceDetails(place.place_id);
      const business = {
        business_name: details.name,
        category,
        phone: details.formatted_phone_number || null,
        address: details.formatted_address,
        city,
        latitude: details.geometry?.location?.lat,
        longitude: details.geometry?.location?.lng,
        has_website: !!details.website,
        website_url: details.website || null,
        has_gmb: true,
        gmb_url: details.url || null,
        google_rating: details.rating || null,
        review_count: details.user_ratings_total || 0,
      };

      // Apply filters
      if (filters.noWebsite && business.has_website) continue;
      if (filters.lowReviews && business.review_count >= 3) continue;

      results.push(business);
    }

    pageToken = data.next_page_token || null;
    pages++;
    if (pageToken) await new Promise((r) => setTimeout(r, 2000)); // API requires delay
  } while (pageToken && pages < maxPages);

  return results;
}

module.exports = { searchBusinesses, getPlaceDetails };
