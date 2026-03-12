const ai = require('../services/ai.service');
const Lead = require('../models/Lead');

exports.generateEmail = async (req, res, next) => {
  try {
    const { lead_id, tone } = req.body;
    const lead = await Lead.findById(lead_id, req.user.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const result = await ai.generateEmail(lead, tone);
    res.json(result);
  } catch (err) { next(err); }
};

exports.generateCallScript = async (req, res, next) => {
  try {
    const { lead_id } = req.body;
    const lead = await Lead.findById(lead_id, req.user.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const result = await ai.generateCallScript(lead);
    res.json(result);
  } catch (err) { next(err); }
};

exports.analyzeLead = async (req, res, next) => {
  try {
    const { lead_id } = req.body;
    const lead = await Lead.findById(lead_id, req.user.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    const result = await ai.analyzeLead(lead);
    res.json(result);
  } catch (err) { next(err); }
};

exports.suggestSearches = async (req, res, next) => {
  try {
    const { city } = req.query;
    if (!city) return res.status(400).json({ error: 'City is required' });
    const result = await ai.suggestSearches(city);
    res.json(result);
  } catch (err) { next(err); }
};
