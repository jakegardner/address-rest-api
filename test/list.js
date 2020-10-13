const supertest = require('supertest');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const mongoose = require('mongoose');
const Address = require('../schemas/mongoose/address');

chai.use(dirtyChai);

function listTests() {
  beforeEach(async () => {
    this.app = await require('../index');
    this.agent = supertest(this.app);
  });
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    this.app.close();
  });

  it('empty list', async () => {
    const res = await this.agent
      .get('/address')
      .expect(200);
    chai.expect(res.body).to.be.empty();
  });

  it('gets existing list successfully', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const addr = await Address.create(address);
    const res = await this.agent
      .get(`/address`)
      .expect(200);
    chai.expect(res.body.length).to.equal(1);
    chai.expect(res.header['x-total-count']).to.equal('1');
    chai.expect(res.body[0].id).to.equal(addr.id);
  });

  it('limits list successfully', async () => {
    const addr = await Address.create({
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    });
    await Address.create({
      name: 'Jeff',
      street: '123 Rainforest Lane',
      city: 'New York',
      state: 'NY',
      country: 'USA',
    });
    const res = await this.agent
      .get(`/address?limit=1`)
      .expect(200);
    chai.expect(res.body.length).to.equal(1);
    chai.expect(res.header['x-total-count']).to.equal('2');
    chai.expect(res.body[0].id).to.equal(addr.id);
  });

  it('skips list successfully', async () => {
    await Address.create({
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    });
    const addr = await Address.create({
      name: 'Jeff',
      street: '123 Rainforest Lane',
      city: 'New York',
      state: 'NY',
      country: 'USA',
    });
    const res = await this.agent
      .get(`/address?skip=1`)
      .expect(200);
    chai.expect(res.body.length).to.equal(1);
    chai.expect(res.header['x-total-count']).to.equal('2');
    chai.expect(res.body[0].id).to.equal(addr.id);
  });

  it('filters by state successfully', async () => {
    await Address.create({
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    });
    const nyAddr = await Address.create({
      name: 'Jeff',
      street: '123 Rainforest Lane',
      city: 'New York',
      state: 'NY',
      country: 'USA',
    });
    const res = await this.agent
      .get(`/address?state=NY`)
      .expect(200);
    chai.expect(res.body.length).to.equal(1);
    chai.expect(res.header['x-total-count']).to.equal('2');
    chai.expect(res.body[0].id).to.equal(nyAddr.id);
  });

  it('filters by country successfully', async () => {
    await Address.create({
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'MEX',
    });
    const nyAddr = await Address.create({
      name: 'Jeff',
      street: '123 Rainforest Lane',
      city: 'New York',
      state: 'NY',
      country: 'USA',
    });
    const res = await this.agent
      .get(`/address?country=USA`)
      .expect(200);
    chai.expect(res.body.length).to.equal(1);
    chai.expect(res.header['x-total-count']).to.equal('2');
    chai.expect(res.body[0].id).to.equal(nyAddr.id);
  });

  it('filters by state & country successfully', async () => {
    await Address.create({
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    });
    const nyAddr = await Address.create({
      name: 'Jeff',
      street: '123 Rainforest Lane',
      city: 'New York',
      state: 'NY',
      country: 'USA',
    });
    const res = await this.agent
      .get(`/address?country=USA&state=NY`)
      .expect(200);
    chai.expect(res.body.length).to.equal(1);
    chai.expect(res.header['x-total-count']).to.equal('2');
    chai.expect(res.body[0].id).to.equal(nyAddr.id);
  });
};

module.exports = listTests;
