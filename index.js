const Koa = require('koa');
const Router = require('koa-joi-router');
const logger = require('koa-logger');
const db = require('./db');

PORT = 8080;

async function main() {
  const app = new Koa();

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

  await db.connect();

  const addressRoutes = require('./routes');
  const address = Router();
  address.prefix('/address');
  address.route(addressRoutes);
  app.use(address.middleware());

  const server = await app.listen(PORT);
  console.log(`Address API listening on ${PORT}`);
  return server;
}

module.exports = main();
