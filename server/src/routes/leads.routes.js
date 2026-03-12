const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/leads.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();
router.use(auth);

router.get('/', ctrl.list);
router.get('/export', ctrl.exportCsv);
router.get('/:id', ctrl.getById);

router.post(
  '/',
  validate({
    body: Joi.object({
      business_name: Joi.string().max(255).required(),
      category: Joi.string().max(100),
      phone: Joi.string().max(50).allow('', null),
      email: Joi.string().email().allow('', null),
      address: Joi.string().allow('', null),
      city: Joi.string().max(100),
      country: Joi.string().max(100),
      has_website: Joi.boolean(),
      website_url: Joi.string().uri().allow('', null),
      has_gmb: Joi.boolean(),
      google_rating: Joi.number().min(0).max(5),
      review_count: Joi.number().integer().min(0),
      status: Joi.string().valid('new', 'contacted', 'replied', 'meeting', 'client', 'lost'),
      notes: Joi.string().allow('', null),
    }),
  }),
  ctrl.create
);

router.put('/:id', ctrl.update);
router.delete('/:id', ctrl.remove);

router.post(
  '/bulk',
  validate({
    body: Joi.object({
      ids: Joi.array().items(Joi.string().uuid()).min(1).required(),
      status: Joi.string().valid('new', 'contacted', 'replied', 'meeting', 'client', 'lost').required(),
    }),
  }),
  ctrl.bulkUpdate
);

module.exports = router;
