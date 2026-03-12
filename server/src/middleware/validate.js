const Joi = require('joi');

function validate(schema) {
  return (req, res, next) => {
    const targets = {};
    if (schema.body) targets.body = req.body;
    if (schema.params) targets.params = req.params;
    if (schema.query) targets.query = req.query;

    for (const [key, data] of Object.entries(targets)) {
      const { error, value } = schema[key].validate(data, { abortEarly: false, stripUnknown: true });
      if (error) {
        return res.status(400).json({ error: error.details.map((d) => d.message).join(', ') });
      }
      req[key] = value;
    }
    next();
  };
}

module.exports = validate;
