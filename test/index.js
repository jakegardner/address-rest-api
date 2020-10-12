const supertest = require('supertest');
const chai = require('chai');
const dirtyChai = require('dirty-chai');

chai.use(dirtyChai);

describe('GET /address', () => {
  beforeEach(() => {
    this.app = require('../index');
  });
  afterEach(() => {
    this.app.close();
  });

  it('empty list', async () => {
    const res = await supertest(this.app)
      .get('/address')
      .expect(200);
    chai.expect(res.body).to.be.empty();
  });

  it('gets existing successfully', async () => {
    const res = await supertest(this.app)
      .get('/address/1')
      .expect(200);
    chai.expect(res.body.id).to.equal('1');
  });

  it('fails for non-existing', async () => {
    const res = await supertest(this.app)
      .get('/address/1')
      .expect(404);
  });
});

describe('POST /address', () => {
  beforeEach(() => {
    this.app = require('../index');
  });
  afterEach(() => {
    this.app.close();
  });

  it('creates new successfully', async () => {
    const address = {
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const res = await supertest(this.app)
      .post('/address', address)
      .expect(201);
    chai.expect(res.body.id).to.not.be.empty();
  });
});

describe('PUT /address', () => {
  beforeEach(() => {
    this.app = require('../index');
  });
  afterEach(() => {
    this.app.close();
  });

  it('updates existing successfully', async () => {
    const address = {
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const res = await supertest(this.app)
      .put('/address/1', address)
      .expect(200);
    chai.expect(res.body.id).to.equal('1');
  });

  it('fails for non-existing', async () => {
    const address = {
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const res = await supertest(this.app)
      .put('/address/2', address)
      .expect(404);
  });
});

describe('DELETE /address', () => {
  beforeEach(() => {
    this.app = require('../index');
  });
  afterEach(() => {
    this.app.close();
  });

  it('deletes existing successfully', async () => {
    const res = await supertest(this.app)
      .delete('/address/1')
      .expect(200);
    chai.expect(res.body.id).to.equal('1');
  });

  it('fails for non-existing', async () => {
    const res = await supertest(this.app)
      .delete('/address/2')
      .expect(404);
  });
});
