const { Router } = require('express');
const Joi = require('joi');
const ctrl = require('../controllers/auth.controller');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = Router();

router.post(
  '/register',
  validate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(8).required(),
      name: Joi.string().max(255),
    }),
  }),
  ctrl.register
);

router.post(
  '/login',
  validate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  ctrl.login
);

router.post('/refresh', auth, ctrl.refresh);
router.get('/me', auth, ctrl.me);

module.exports = router;
