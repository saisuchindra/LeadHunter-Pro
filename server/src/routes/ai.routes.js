const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/ai.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();
router.use(auth);

router.post(
  '/generate-email',
  validate({
    body: Joi.object({
      lead_id: Joi.string().uuid().required(),
      tone: Joi.string().valid('professional', 'friendly', 'urgent', 'casual').default('professional'),
    }),
  }),
  ctrl.generateEmail
);

router.post(
  '/generate-call-script',
  validate({
    body: Joi.object({
      lead_id: Joi.string().uuid().required(),
    }),
  }),
  ctrl.generateCallScript
);

router.post(
  '/analyze-lead',
  validate({
    body: Joi.object({
      lead_id: Joi.string().uuid().required(),
    }),
  }),
  ctrl.analyzeLead
);

router.get('/suggest-searches', ctrl.suggestSearches);

module.exports = router;
