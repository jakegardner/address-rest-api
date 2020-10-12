const { Joi } = require('koa-joi-router');
const addressSchema = require('../schemas/joi/address');
const isValidState = require('../lib/validate-state');

module.exports = {
  method: 'post',
  path: '/',
  validate: {
    type: 'json',
    body: addressSchema,
  },
  handler: async (ctx) => {
    const payload = ctx.request.body;
    const { state, country } = payload;

    if (!(await isValidState({ state, country }))) {
      ctx.throw(400, `Invalid state, country combination: ${state}, ${country}`);
    }

    const id = String(ctx.addresses.length);
    const newAddress = { id, ...ctx.request.body };
    ctx.addresses.push(newAddress);
    ctx.body = { id };
    ctx.status = 201;
  },
};
