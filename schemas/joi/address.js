const { Joi } = require('koa-joi-router');

const addressSchema = {
  name: Joi.string().required().max(50),
  street: Joi.string().required().max(50),
  city: Joi.string().required().max(50),
  state: Joi.string().required().min(2).max(2),
  country: Joi.string().required().min(3).max(3),
};

module.exports = addressSchema;
