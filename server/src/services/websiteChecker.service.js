const axios = require('axios');
const cheerio = require('cheerio');

async function analyzeWebsite(url) {
  if (!url) {
    return { hasWebsite: false, issues: ['no_website'] };
  }

  try {
    const response = await axios.get(url, {
      timeout: 8000,
      headers: { 'User-Agent': 'LeadHunter-Bot/1.0' },
      maxRedirects: 3,
    });
    const $ = cheerio.load(response.data);

    return {
      hasWebsite: true,
      isDown: false,
      hasSSL: url.startsWith('https'),
      hasMeta: $('meta[name="description"]').length > 0,
      hasContactPage: $('a[href*="contact"]').length > 0,
      pageTitle: $('title').text().trim(),
      wordCount: $('body').text().split(/\s+/).filter(Boolean).length,
      isMobileFriendly: $('meta[name="viewport"]').length > 0,
      issues: buildIssues($, url),
    };
  } catch {
    return { hasWebsite: true, isDown: true, issues: ['website_down'] };
  }
}

function buildIssues($, url) {
  const issues = [];
  if (!url.startsWith('https')) issues.push('no_ssl');
  if (!$('meta[name="description"]').length) issues.push('no_meta_description');
  if (!$('meta[name="viewport"]').length) issues.push('not_mobile_friendly');
  if (!$('a[href*="contact"]').length) issues.push('no_contact_page');
  return issues;
}

module.exports = { analyzeWebsite };
