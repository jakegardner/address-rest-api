const Koa = require('koa');
const router = require('@koa/router')();

PORT = 8080;

const app = new Koa();

app.context.addresses = [];

router.get('/address', async (ctx) => {
  ctx.body = ctx.addresses;
  ctx.status = 200;
});

router.get('/address/:id', async (ctx) => {
  const id = ctx.params.id;
  if (!id) ctx.throw(400, 'missing id');
  if (id >= ctx.addresses.length) ctx.throw(404, 'address not found');
  ctx.body = ctx.addresses[id];
  ctx.status = 200;
});

router.post('/address', async (ctx) => {
  const id = String(ctx.addresses.length);
  const newAddress = { id, ...ctx.request.body };
  ctx.addresses.push(newAddress);
  ctx.body = { id };
  ctx.status = 201;
});

router.put('/address/:id', async (ctx) => {
  const id = ctx.params.id;
  if (!id) ctx.throw(400, 'missing id');
  if (id >= ctx.addresses.length) ctx.throw(404, 'address not found');

  ctx.addresses[id] = { id, ...ctx.request.body };
  ctx.body = ctx.addresses[id];
  ctx.status = 200;
});

router.delete('/address/:id', async (ctx) => {
  const id = ctx.params.id;
  if (!id) ctx.throw(400, 'missing id');
  if (id >= ctx.addresses.length) ctx.throw(404, 'address not found');

  ctx.body = ctx.addresses[id];
  ctx.status = 200;
});


app.use(router.routes());


const server = app.listen(PORT, () => console.log(`\tAddress API listening on ${PORT}`));

module.exports = server;
