const supertest = require('supertest');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const Address = require('../schemas/mongoose/address');
chai.use(dirtyChai);

function updateTests() {
  beforeEach(async () => {
    this.app = await require('../index');
    this.agent = supertest(this.app);
    this.sandbox = sinon.createSandbox();
    this.sandbox.stub(fetch, 'Promise').returns(Promise.resolve({
      'RestResponse': {
        'messages': [ 'State found' ],
        'result': {
          'id': 5,
          'country': 'USA',
          'name': 'California',
          'abbr': 'CA',
          'area': '423967SKM',
          'largest_city': 'Los Angeles',
          'capital' : 'Sacramento'
        },
      },
    }));
  });
  afterEach(async () => {
    this.sandbox.restore();
    await mongoose.connection.dropDatabase();
    this.app.close();
  });

  it('updates existing successfully', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const addr = await Address.create(address);
    const res = await this.agent
      .put(`/address/${addr.id}`)
      .send(address)
      .expect(200);
    chai.expect(res.body.id).to.equal(addr.id);
  });

  it('fails for non-existing', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const res = await this.agent
      .put('/address/5f8567031bcffcaef222e5a3')
      .send(address)
      .expect(404);
  });

  it('fails if state is not 2 char code', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'California',
      country: 'USA',
    };
    const addr = await Address.create(address);
    const res = await this.agent
      .put(`/address/${addr.id}`)
      .send(address)
      .expect(400);
  });

  it('fails if country is not 3 char code', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'United States',
    };
    const addr = await Address.create(address);
    const res = await this.agent
      .put(`/address/${addr.id}`)
      .send(address)
      .expect(400);
  });

  it('fails if invalid state/country combo', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CX',
      country: 'USA',
    };
    this.sandbox.restore();
    this.sandbox.stub(fetch, 'Promise').returns(Promise.resolve({
      'RestResponse': {
        'messages': [ 'No matching state found' ],
      }
    }));
    const addr = await Address.create(address);
    const res = await this.agent
      .put(`/address/${addr.id}`)
      .send(address)
      .expect(400);
  });

  it('fails if address deleted', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const addr = await Address.create(address);
    addr.set('deletedAt', Date.now());
    await addr.save();
    const res = await this.agent
      .put(`/address/${addr.id}`)
      .send(address)
      .expect(404);
  });
};

module.exports = updateTests;
