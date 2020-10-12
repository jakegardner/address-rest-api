const { Joi } = require('koa-joi-router');

module.exports = {
  method: 'get',
  path: '/:id',
  validate: {
    params: {
      id: Joi.string().required(),
    },
  },
  handler: async (ctx) => {
    const id = ctx.params.id;
    if (id >= ctx.addresses.length) ctx.throw(404, 'address not found');
    ctx.body = ctx.addresses[id];
    ctx.status = 200;
  },
};
