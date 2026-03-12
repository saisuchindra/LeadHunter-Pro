// Background search worker using Bull queue
// Requires Redis running. Falls back gracefully if unavailable.

let Queue;
try {
  Queue = require('bull');
} catch {
  // Bull not available, no-op
}

const googlePlaces = require('../services/googlePlaces.service');
const websiteChecker = require('../services/websiteChecker.service');
const scraper = require('../services/scraper.service');
const leadScorer = require('../services/leadScorer.service');
const Lead = require('../models/Lead');

let searchQueue = null;

function initSearchQueue(redisUrl) {
  if (!Queue) return null;
  try {
    searchQueue = new Queue('lead-search', redisUrl);

    searchQueue.process(async (job) => {
      const { category, city, radius, filters, userId } = job.data;
      const businesses = await googlePlaces.searchBusinesses({ category, city, radius, filters });
      const results = [];

      for (let i = 0; i < businesses.length; i++) {
        const biz = businesses[i];
        const websiteAnalysis = await websiteChecker.analyzeWebsite(biz.website_url);
        let scraperData = { emails: [], socialLinks: {}, hasSocial: false };
        if (biz.website_url && !websiteAnalysis.isDown) {
          scraperData = await scraper.scrapePage(biz.website_url);
        }

        const leadData = {
          ...biz,
          has_website: websiteAnalysis.hasWebsite && !websiteAnalysis.isDown,
          websiteAnalysis,
          has_social: scraperData.hasSocial,
          instagram_url: scraperData.socialLinks.instagram,
          facebook_url: scraperData.socialLinks.facebook,
          email: biz.email || scraperData.emails[0] || null,
        };

        const { score, reasons } = leadScorer.calculateScore(leadData);
        leadData.opportunity_score = score;
        leadData.score_reasons = reasons;

        const saved = await Lead.create({ ...leadData, user_id: userId });
        results.push(saved);

        job.progress(Math.round(((i + 1) / businesses.length) * 100));
      }

      return { count: results.length };
    });

    return searchQueue;
  } catch {
    return null;
  }
}

module.exports = { initSearchQueue, getQueue: () => searchQueue };
