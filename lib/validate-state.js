const fetch = require('node-fetch');

const isValidState = async ({ country, state }) => {
  let response = await fetch(`http://www.groupkt.com/state/get/${country}/${state}`);
  response = response.json ? await response.json() : response;
  return response && !!response.RestResponse.result;
};

module.exports = isValidState;
