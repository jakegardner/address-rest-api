const Koa = require('koa');
const Router = require('koa-joi-router');
const logger = require('koa-logger');

PORT = 8080;

const app = new Koa();

app.context.addresses = [];

app.use(logger());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    ctx.status = error.status || 500;
    ctx.body = error.body || error.message;
    console.log(ctx.body);
  }
});

const addressRoutes = require('./routes');
const address = Router();
address.prefix('/address');
address.route(addressRoutes);
app.use(address.middleware());

const server = app.listen(PORT, () => console.log(`\tAddress API listening on ${PORT}`));

module.exports = server;
