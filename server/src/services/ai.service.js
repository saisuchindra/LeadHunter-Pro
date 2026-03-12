const axios = require('axios');
const env = require('../config/env');

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

async function chat(messages, { maxTokens = 1024, temperature = 0.7 } = {}) {
  const { data } = await axios.post(
    OPENROUTER_URL,
    {
      model: env.openRouter.model,
      messages,
      max_tokens: maxTokens,
      temperature,
    },
    {
      headers: {
        Authorization: `Bearer ${env.openRouter.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'LeadHunter Pro',
      },
    }
  );
  return data.choices[0].message.content;
}

// Generate a personalized outreach email for a lead
exports.generateEmail = async (lead, tone = 'professional') => {
  const messages = [
    {
      role: 'system',
      content: `You are an expert cold outreach copywriter for a digital marketing agency. Write compelling, personalized emails that get replies. Tone: ${tone}. Keep emails concise (under 150 words). Always include a clear CTA. Return ONLY a JSON object with "subject" and "body" keys, no markdown.`,
    },
    {
      role: 'user',
      content: `Write a cold outreach email for this business:
- Name: ${lead.business_name}
- Category: ${lead.category}
- City: ${lead.city}
- Has Website: ${lead.has_website ? 'Yes' : 'No'}
- Website Issues: ${lead.score_reasons?.join(', ') || 'None identified'}
- Opportunity Score: ${lead.opportunity_score}/100
- Email: ${lead.email || 'unknown'}`,
    },
  ];
  const result = await chat(messages);
  try {
    return JSON.parse(result.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
  } catch {
    return { subject: 'Grow Your Business Online', body: result };
  }
};

// Generate a call script for a lead
exports.generateCallScript = async (lead) => {
  const messages = [
    {
      role: 'system',
      content: 'You are a sales coach creating cold call scripts for a digital marketing agency. Create structured scripts with Opening, Pain Point, Value Prop, Objection Handling, and Close sections. Return ONLY a JSON object with keys: "opening", "pain_point", "value_prop", "objections" (array of {objection, response}), "close". No markdown.',
    },
    {
      role: 'user',
      content: `Create a cold call script for:
- Business: ${lead.business_name}
- Category: ${lead.category}
- City: ${lead.city}
- Has Website: ${lead.has_website ? 'Yes but with issues' : 'No website'}
- Issues: ${lead.score_reasons?.join(', ') || 'Weak online presence'}`,
    },
  ];
  const result = await chat(messages, { maxTokens: 1500 });
  try {
    return JSON.parse(result.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
  } catch {
    return { opening: result, pain_point: '', value_prop: '', objections: [], close: '' };
  }
};

// Analyze a lead's online presence and give recommendations
exports.analyzeLead = async (lead) => {
  const messages = [
    {
      role: 'system',
      content: 'You are a digital marketing analyst. Analyze the business and provide actionable insights. Return ONLY a JSON object with keys: "summary" (2-3 sentences), "strengths" (array), "weaknesses" (array), "recommendations" (array of actionable steps), "estimated_revenue_impact" (string). No markdown.',
    },
    {
      role: 'user',
      content: `Analyze this local business:
- Name: ${lead.business_name}
- Category: ${lead.category}
- City: ${lead.city}
- Phone: ${lead.phone || 'Not listed'}
- Website: ${lead.website_url || 'None'}
- Has Website: ${lead.has_website}
- Rating: ${lead.rating || 'Unknown'}
- Reviews: ${lead.review_count || 0}
- Has Social Media: ${lead.has_social}
- Score: ${lead.opportunity_score}/100
- Issues: ${lead.score_reasons?.join(', ') || 'None'}`,
    },
  ];
  const result = await chat(messages, { maxTokens: 1500 });
  try {
    return JSON.parse(result.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
  } catch {
    return { summary: result, strengths: [], weaknesses: [], recommendations: [], estimated_revenue_impact: 'Unknown' };
  }
};

// AI-powered search: suggest search queries based on city
exports.suggestSearches = async (city) => {
  const messages = [
    {
      role: 'system',
      content: 'You are a lead generation expert. Suggest the best business categories to search for in a given city that are most likely to need digital marketing help (no website, weak online presence). Return ONLY a JSON array of objects with "category" and "reason" keys. Max 8 suggestions. No markdown.',
    },
    {
      role: 'user',
      content: `What types of local businesses in ${city} are most likely to need digital marketing help? Think: restaurants without websites, local shops with no Google reviews, service businesses with no online presence.`,
    },
  ];
  const result = await chat(messages, { maxTokens: 800 });
  try {
    return JSON.parse(result.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
  } catch {
    return [{ category: 'restaurant', reason: 'Many lack websites' }];
  }
};

module.exports = exports;
