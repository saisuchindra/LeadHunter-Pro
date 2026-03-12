const Lead = require('../models/Lead');

exports.list = async (req, res, next) => {
  try {
    const result = await Lead.list(req.user.id, req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id, req.user.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const lead = await Lead.create({ ...req.body, user_id: req.user.id });
    res.status(201).json(lead);
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const lead = await Lead.update(req.params.id, req.user.id, req.body);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    res.json(lead);
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const deleted = await Lead.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Lead not found' });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
};

exports.bulkUpdate = async (req, res, next) => {
  try {
    const { ids, status } = req.body;
    const count = await Lead.bulkUpdateStatus(ids, req.user.id, status);
    res.json({ updated: count });
  } catch (err) {
    next(err);
  }
};

exports.exportCsv = async (req, res, next) => {
  try {
    const { leads } = await Lead.list(req.user.id, { ...req.query, limit: 10000, offset: 0 });
    const header = 'Business Name,Category,City,Phone,Email,Score,Status\n';
    const rows = leads.map((l) =>
      [l.business_name, l.category, l.city, l.phone, l.email, l.opportunity_score, l.status]
        .map((v) => `"${(v || '').toString().replace(/"/g, '""')}"`)
        .join(',')
    );
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
    res.send(header + rows.join('\n'));
  } catch (err) {
    next(err);
  }
};
