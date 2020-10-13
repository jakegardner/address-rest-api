const supertest = require('supertest');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const fetch = require('node-fetch');
const mongoose = require('mongoose');
const Address = require('../schemas/mongoose/address');
chai.use(dirtyChai);

function createTests() {
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

  it('creates new successfully', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const res = await this.agent
      .post('/address')
      .send(address)
      .expect(201);
    chai.expect(res.body.id).to.not.be.empty();
  });

  it('fails if state is not 2 char code', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'California',
      country: 'USA',
    };
    const res = await this.agent
      .post('/address')
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
    const res = await this.agent
      .post('/address')
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
    const res = await this.agent
      .post('/address')
      .send(address)
      .expect(400);
  });
};

module.exports = createTests;
