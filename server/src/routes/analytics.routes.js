const { Router } = require('express');
const auth = require('../middleware/auth');
const Lead = require('../models/Lead');
const OutreachLog = require('../models/OutreachLog');

const router = Router();
router.use(auth);

router.get('/overview', async (req, res, next) => {
  try {
    const stats = await Lead.getStats(req.user.id);
    res.json(stats);
  } catch (err) { next(err); }
});

router.get('/funnel', async (req, res, next) => {
  try {
    const funnel = await Lead.getFunnel(req.user.id);
    res.json(funnel);
  } catch (err) { next(err); }
});

router.get('/categories', async (req, res, next) => {
  try {
    const categories = await Lead.getCategoryBreakdown(req.user.id);
    res.json(categories);
  } catch (err) { next(err); }
});

router.get('/daily', async (req, res, next) => {
  try {
    const days = parseInt(req.query.days, 10) || 14;
    const daily = await Lead.getDailyLeads(req.user.id, days);
    res.json(daily);
  } catch (err) { next(err); }
});

router.get('/activity', async (req, res, next) => {
  try {
    const activity = await OutreachLog.getRecent(req.user.id, 20);
    res.json(activity);
  } catch (err) { next(err); }
});

module.exports = router;
