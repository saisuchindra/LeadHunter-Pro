const googlePlaces = require('../services/googlePlaces.service');
const websiteChecker = require('../services/websiteChecker.service');
const scraper = require('../services/scraper.service');
const leadScorer = require('../services/leadScorer.service');
const ai = require('../services/ai.service');
const Lead = require('../models/Lead');

exports.scan = async (req, res, next) => {
  try {
    const { category, city, radius, filters } = req.body;

    // Search via Google Places
    const businesses = await googlePlaces.searchBusinesses({ category, city, radius, filters });

    const enriched = [];

    for (const biz of businesses) {
      // Analyze website if exists
      const websiteAnalysis = await websiteChecker.analyzeWebsite(biz.website_url);

      // Scrape for social links & email if website exists
      let scraperData = { emails: [], socialLinks: {}, hasSocial: false };
      if (biz.website_url && !websiteAnalysis.isDown) {
        scraperData = await scraper.scrapePage(biz.website_url);
      }

      // Calculate score
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

      // Save to DB
      const saved = await Lead.create({ ...leadData, user_id: req.user.id });

      // AI analysis (non-blocking, don't fail the scan if AI is down)
      try {
        const analysis = await ai.analyzeLead(saved);
        saved.ai_analysis = analysis;
      } catch (_) {
        saved.ai_analysis = null;
      }

      enriched.push(saved);
    }

    res.json({ count: enriched.length, leads: enriched });
  } catch (err) {
    next(err);
  }
};
