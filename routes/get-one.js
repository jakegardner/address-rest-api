const { Joi } = require('koa-joi-router');
Joi.objectId = require('joi-objectid')(Joi);
const Address = require('../schemas/mongoose/address');
const sanitize = require('../schemas/mongoose/sanitize');

module.exports = {
  method: 'get',
  path: '/:id',
  validate: {
    params: {
      id: Joi.objectId().required(),
    },
  },
  handler: async (ctx) => {
    const match = { _id: ctx.request.params.id, deletedAt: { $exists: false } };
    const address = await Address.findOne(match).exec();
    if (!address) {
      ctx.throw(404, 'Address not found');
    }

    ctx.body = sanitize(address);
    ctx.status = 200;
  },
};
