const { Joi } = require('koa-joi-router');
Joi.objectId = require('joi-objectid')(Joi);
const Address = require('../schemas/mongoose/address');
const sanitize = require('../schemas/mongoose/sanitize');

module.exports = {
  method: 'delete',
  path: '/:id',
  validate: {
    params: {
      id: Joi.objectId().required(),
    },
  },
  handler: async (ctx) => {
    const address = await Address.findOne({ _id: ctx.request.params.id  }).exec();
    if (!address) {
      ctx.throw(404, 'Address not found');
    }

    if (!address.deletedAt) {
      address.set({ deletedAt: Date.now() });
      await address.save();
    }

    ctx.body = sanitize(address);
    ctx.status = 200;
  },
};
