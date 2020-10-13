const { Joi } = require('koa-joi-router');
Joi.objectId = require('joi-objectid')(Joi);
const Address = require('../schemas/mongoose/address');
const addressSchema = require('../schemas/joi/address');
const isValidState = require('../lib/validate-state');
const sanitize = require('../schemas/mongoose/sanitize');

module.exports = {
  method: 'put',
  path: '/:id',
  validate: {
    params: {
      id: Joi.objectId().required(),
    },
    type: 'json',
    body: addressSchema,
  },
  handler: async (ctx) => {
    const match = { _id: ctx.request.params.id, deletedAt: { $exists: false } };
    const address = await Address.findOne(match).exec();
    if (!address) {
      ctx.throw(404, 'Address not found');
    }

    const payload = ctx.request.body;
    const { state, country } = payload;
    if (!(await isValidState({ state, country }))) {
      ctx.throw(400, `Invalid state, country combination: ${state}, ${country}`);
    }

    address.set({ ...payload, updatedAt: Date.now() });
    await address.save();

    ctx.body = sanitize(address);
    ctx.status = 200;
  },
};
