const mongoose = require('mongoose');

const listTests = require('./list');
const getOneTests = require('./get-one');
const createTests = require('./create');
const updateTests = require('./update');
const deleteTests = require('./delete');

describe('Address API', function() {
  after(async () => {
    await mongoose.connection.close();
  });
  describe('GET /address', listTests);
  describe('GET /address/:id', getOneTests);
  describe('POST /address', createTests);
  describe('PUT /address/:id', updateTests);
  describe('DELETE /address', deleteTests);
});
