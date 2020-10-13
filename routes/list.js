const { Joi } = require('koa-joi-router');
const _ = require('lodash');
const Address = require('../schemas/mongoose/address');
const sanitize = require('../schemas/mongoose/sanitize');

module.exports = {
  method: 'get',
  path: '/',
  validate: {
    query: {
      state: Joi.string().min(2).max(2),
      country: Joi.string().min(3).max(3),
      limit: Joi.number().positive().integer().default(10).min(1).max(100),
      skip: Joi.number().positive().integer().default(0).min(0),
    },
  },
  handler: async (ctx) => {
    const { country, state } = ctx.request.query;
    const match = _.pickBy({ country, state }, _.identity);
    let query = Address.find({ ...match, deletedAt: { $exists: false } });

    ['limit', 'skip'].forEach((operator) => {
      const param = ctx.request.query[operator];
      if (param) {
        query = query[operator](param);
      }
    });

    const [count, addresses] = await Promise.all([
      Address.estimatedDocumentCount(match).exec(),
      query.exec(),
    ]);

    ctx.set('X-total-count', count);
    ctx.body = addresses.map(sanitize);
    ctx.status = 200;
  },
};
