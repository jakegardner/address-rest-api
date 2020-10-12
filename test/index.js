const supertest = require('supertest');
const chai = require('chai');
const dirtyChai = require('dirty-chai');
const sinon = require('sinon');
const fetch = require('node-fetch');

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
  afterEach(() => {
    this.sandbox.restore();
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
    const res = await supertest(this.app)
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
    const res = await supertest(this.app)
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
    const res = await supertest(this.app)
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
    const res = await supertest(this.app)
      .post('/address')
      .send(address)
      .expect(400);
  });
});

describe('PUT /address', () => {
  beforeEach(() => {
    this.app = require('../index');
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
  afterEach(() => {
    this.sandbox.restore();
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
    const res = await supertest(this.app)
      .put('/address/1')
      .send(address)
      .expect(200);
    chai.expect(res.body.id).to.equal('1');
  });

  it('fails for non-existing', async () => {
    const address = {
      name: 'Steve',
      street: '123 Apple Lane',
      city: 'Cupertino',
      state: 'CA',
      country: 'USA',
    };
    const res = await supertest(this.app)
      .put('/address/2')
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
    const res = await supertest(this.app)
      .put('/address/1')
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
    const res = await supertest(this.app)
      .put('/address/1')
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
    const res = await supertest(this.app)
      .put('/address/1')
      .send(address)
      .expect(400);
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
