const axios = require('axios');
const cheerio = require('cheerio');

async function scrapePage(url) {
  try {
    const { data } = await axios.get(url, {
      timeout: 8000,
      headers: { 'User-Agent': 'LeadHunter-Bot/1.0' },
      maxRedirects: 3,
    });
    const $ = cheerio.load(data);

    // Extract social links
    const socialLinks = {
      instagram: null,
      facebook: null,
    };
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') || '';
      if (href.includes('instagram.com/') && !socialLinks.instagram) socialLinks.instagram = href;
      if (href.includes('facebook.com/') && !socialLinks.facebook) socialLinks.facebook = href;
    });

    // Extract emails from page text
    const text = $('body').text();
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const emails = [...new Set(text.match(emailRegex) || [])];

    return {
      title: $('title').text().trim(),
      emails,
      socialLinks,
      hasSocial: !!(socialLinks.instagram || socialLinks.facebook),
    };
  } catch {
    return { title: '', emails: [], socialLinks: {}, hasSocial: false };
  }
}

module.exports = { scrapePage };
