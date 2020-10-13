const supertest = require('supertest');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const mongoose = require('mongoose');
const Address = require('../schemas/mongoose/address');
chai.use(dirtyChai);

function deleteTests() {
  beforeEach(async () => {
    this.app = await require('../index');
    this.agent = supertest(this.app);
  });
  afterEach(async () => {
    await mongoose.connection.dropDatabase();
    this.app.close();
  });

  it('deletes existing successfully', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'United States',
    };
    const addr = await Address.create(address);
    const res = await this.agent
      .delete(`/address/${addr.id}`)
      .expect(200);
    chai.expect(res.body.id).to.equal(addr.id);
  });

  it('fails for non-existing', async () => {
    const res = await this.agent
      .delete('/address/5f8567031bcffcaef222e5a3')
      .expect(404);
  });

  it('successfully marks address deleted', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'United States',
    };
    const addr = await Address.create(address);
    const res = await this.agent
      .delete(`/address/${addr.id}`)
      .send(address)
      .expect(200);
    const afterQuery = await Address.findById(addr.id);
    chai.expect(afterQuery.deletedAt).to.exist();
  });

  it('succeeds if address already deleted, without updating timestamp', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'United States',
    };
    const addr = await Address.create(address);
    const timestamp = Date.now();
    addr.set('deletedAt', timestamp);
    await addr.save();
    const res = await this.agent
      .delete(`/address/${addr.id}`)
      .send(address)
      .expect(200);
    const afterQuery = await Address.findById(addr.id);
    chai.expect(Date.parse(afterQuery.deletedAt)).to.be.lt(timestamp);
  });
};

module.exports = deleteTests;
