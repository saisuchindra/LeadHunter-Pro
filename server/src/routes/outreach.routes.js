const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/outreach.controller');
const auth = require('../middleware/auth');
const { emailLimiter } = require('../middleware/rateLimit');
const validate = require('../middleware/validate');

const router = Router();
router.use(auth);

// Outreach logs
router.get('/:leadId', ctrl.getLogs);

router.post(
  '/email',
  emailLimiter,
  validate({
    body: Joi.object({
      lead_id: Joi.string().uuid().required(),
      template_id: Joi.string().uuid().allow(null),
      subject: Joi.string().max(500).required(),
      body: Joi.string().required(),
      variables: Joi.object().default({}),
    }),
  }),
  ctrl.sendEmail
);

router.post(
  '/log-call',
  validate({
    body: Joi.object({
      lead_id: Joi.string().uuid().required(),
      notes: Joi.string().allow('', null),
      call_duration: Joi.number().integer().min(0),
      outcome: Joi.string().allow('', null),
    }),
  }),
  ctrl.logCall
);

// Templates
router.get('/templates/list', ctrl.getTemplates);
router.post(
  '/templates',
  validate({
    body: Joi.object({
      name: Joi.string().max(255).required(),
      subject: Joi.string().max(500).required(),
      body: Joi.string().required(),
      type: Joi.string().max(100),
      variables: Joi.array().items(Joi.string()),
    }),
  }),
  ctrl.createTemplate
);
router.put('/templates/:id', ctrl.updateTemplate);
router.delete('/templates/:id', ctrl.deleteTemplate);

module.exports = router;
