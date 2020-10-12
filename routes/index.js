const requireDirectory = require('require-directory');

module.exports = Object.values(requireDirectory(module));
