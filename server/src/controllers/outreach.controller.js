const OutreachLog = require('../models/OutreachLog');
const EmailTemplate = require('../models/EmailTemplate');
const Lead = require('../models/Lead');
const emailSender = require('../services/emailSender.service');

exports.getLogs = async (req, res, next) => {
  try {
    const logs = await OutreachLog.findByLead(req.params.leadId);
    res.json(logs);
  } catch (err) {
    next(err);
  }
};

exports.sendEmail = async (req, res, next) => {
  try {
    const { lead_id, template_id, subject, body, variables } = req.body;
    const lead = await Lead.findById(lead_id, req.user.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });
    if (!lead.email) return res.status(400).json({ error: 'Lead has no email address' });

    const vars = {
      business_name: lead.business_name,
      city: lead.city,
      ...variables,
    };

    await emailSender.sendEmail({ to: lead.email, subject, body, variables: vars });

    if (template_id) {
      await EmailTemplate.incrementUsage(template_id);
    }

    const log = await OutreachLog.create({
      lead_id,
      user_id: req.user.id,
      type: 'email',
      subject,
      body,
      status: 'sent',
    });

    // Update lead status if still 'new'
    if (lead.status === 'new') {
      await Lead.update(lead.id, req.user.id, { status: 'contacted' });
    }

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

exports.logCall = async (req, res, next) => {
  try {
    const { lead_id, notes, call_duration, outcome } = req.body;
    const lead = await Lead.findById(lead_id, req.user.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const log = await OutreachLog.create({
      lead_id,
      user_id: req.user.id,
      type: 'call',
      body: notes,
      status: outcome || 'completed',
    });
    if (call_duration) {
      await OutreachLog.updateStatus(log.id, log.status, { call_duration });
    }

    if (lead.status === 'new') {
      await Lead.update(lead.id, req.user.id, { status: 'contacted' });
    }

    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
};

// Template CRUD
exports.getTemplates = async (req, res, next) => {
  try {
    res.json(await EmailTemplate.list(req.user.id));
  } catch (err) { next(err); }
};

exports.createTemplate = async (req, res, next) => {
  try {
    const template = await EmailTemplate.create({ ...req.body, user_id: req.user.id });
    res.status(201).json(template);
  } catch (err) { next(err); }
};

exports.updateTemplate = async (req, res, next) => {
  try {
    const template = await EmailTemplate.update(req.params.id, req.user.id, req.body);
    if (!template) return res.status(404).json({ error: 'Template not found' });
    res.json(template);
  } catch (err) { next(err); }
};

exports.deleteTemplate = async (req, res, next) => {
  try {
    const deleted = await EmailTemplate.delete(req.params.id, req.user.id);
    if (!deleted) return res.status(404).json({ error: 'Template not found' });
    res.json({ success: true });
  } catch (err) { next(err); }
};
