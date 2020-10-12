const fetch = require('node-fetch');

const isValidState = async ({ country, state }) => {
  const response = await fetch(`http://www.groupkt.com/state/get/${country}/${state}`);
  return response && !!response.RestResponse.result;
};

module.exports = isValidState;
