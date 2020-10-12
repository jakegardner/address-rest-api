const { Joi } = require('koa-joi-router');

module.exports = {
  method: 'get',
  path: '/',
  validate: {
  },
  handler: async (ctx) => {
    ctx.body = ctx.addresses;
    ctx.status = 200;
  },
};
