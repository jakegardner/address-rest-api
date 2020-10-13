const mongoose = require('mongoose');
mongoose.Promise = global.Promise;


mongoose.connection.on('error', (err) => {
  if (err) {
    console.log(err);
  }
});

mongoose.connection.on('open', (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log(`connected to ${mongoose.connection.db.s.namespace.db}`);
  }
});

const connect = async () => {
  try {
    const uri = process.env.NODE_ENV == 'test' ? 'mongodb://localhost/address-test' : 'mongodb://localhost/address-prod';
    await mongoose.connect(uri);
    return Promise.resolve();
  } catch (err) {
    return Promise.reject(err);
  }
};

module.exports = { connect };
