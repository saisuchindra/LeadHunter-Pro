const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/search.controller');
const auth = require('../middleware/auth');
const { searchLimiter } = require('../middleware/rateLimit');
const validate = require('../middleware/validate');

const router = Router();
router.use(auth);

router.post(
  '/scan',
  searchLimiter,
  validate({
    body: Joi.object({
      category: Joi.string().required(),
      city: Joi.string().required(),
      radius: Joi.number().min(1).max(50).default(10),
      filters: Joi.object({
        noWebsite: Joi.boolean(),
        noGmb: Joi.boolean(),
        lowReviews: Joi.boolean(),
        noSocial: Joi.boolean(),
      }).default({}),
    }),
  }),
  ctrl.scan
);

module.exports = router;
