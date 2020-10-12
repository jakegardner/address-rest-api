const { Joi } = require('koa-joi-router');
const addressSchema = require('../schemas/joi/address');
const isValidState = require('../lib/validate-state');

module.exports = {
  method: 'put',
  path: '/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
    type: 'json',
    body: addressSchema,
  },
  handler: async (ctx) => {
    const payload = ctx.request.body;
    const { state, country } = payload;

    if (!(await isValidState({ state, country }))) {
      ctx.throw(400, `Invalid state, country combination: ${state}, ${country}`);
    }

    const id = ctx.params.id;
    if (id >= ctx.addresses.length) ctx.throw(404, 'address not found');

    ctx.addresses[id] = { id, ...ctx.request.body };
    ctx.body = ctx.addresses[id];
    ctx.status = 200;
  },
};
