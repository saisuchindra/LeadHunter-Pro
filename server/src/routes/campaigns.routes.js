const { Router } = require('express');
const Joi = require('joi');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const Campaign = require('../models/Campaign');

const router = Router();
router.use(auth);

router.get('/', async (req, res, next) => {
  try {
    res.json(await Campaign.list(req.user.id));
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const c = await Campaign.findById(req.params.id, req.user.id);
    if (!c) return res.status(404).json({ error: 'Campaign not found' });
    res.json(c);
  } catch (err) { next(err); }
});

router.post(
  '/',
  validate({
    body: Joi.object({
      name: Joi.string().max(255).required(),
      type: Joi.string().valid('email', 'call', 'mixed').default('email'),
      lead_filter: Joi.object(),
      sequence: Joi.array().items(Joi.object({
        day: Joi.number().integer().min(0).required(),
        template_id: Joi.string().uuid(),
        action: Joi.string(),
      })),
    }),
  }),
  async (req, res, next) => {
    try {
      const campaign = await Campaign.create({ ...req.body, user_id: req.user.id });
      res.status(201).json(campaign);
    } catch (err) { next(err); }
  }
);

router.put('/:id', async (req, res, next) => {
  try {
    const campaign = await Campaign.update(req.params.id, req.user.id, req.body);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) { next(err); }
});

router.post('/:id/activate', async (req, res, next) => {
  try {
    const campaign = await Campaign.update(req.params.id, req.user.id, { status: 'active' });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) { next(err); }
});

router.post('/:id/pause', async (req, res, next) => {
  try {
    const campaign = await Campaign.update(req.params.id, req.user.id, { status: 'paused' });
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) { next(err); }
});

router.get('/:id/stats', async (req, res, next) => {
  try {
    const c = await Campaign.findById(req.params.id, req.user.id);
    if (!c) return res.status(404).json({ error: 'Campaign not found' });
    res.json(c.stats || { sent: 0, opened: 0, replied: 0 });
  } catch (err) { next(err); }
});

module.exports = router;
