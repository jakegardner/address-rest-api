const supertest = require('supertest');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const mongoose = require('mongoose');
const Address = require('../schemas/mongoose/address');
chai.use(dirtyChai);

function getOneTests() {
  beforeEach(async () => {
    this.app = await require('../index');
    this.agent = supertest(this.app);
  });
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    this.app.close();
  });

  it('gets one existing successfully', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const addr = await Address.create(address);
    const res = await this.agent
      .get(`/address/${addr.id}`)
      .expect(200);
    chai.expect(res.body.id).to.equal(addr.id);
  });

  it('gets one fails for invalid id parameter', async () => {
    const res = await this.agent
      .get(`/address/@#%20&GHhehmGL23A#&{}|{!#&^GSFJKS1U#YRG})<>Laf`)
      .expect(400);
  });

  it('fails for non-existing', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const addr = await Address.create(address);
    const res = await this.agent
      .get(`/address/5f8567031bcffcaef222e5a3`)
      .expect(404);
  });
};

module.exports = getOneTests;
