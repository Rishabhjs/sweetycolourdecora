const server = require('../server');

module.exports = server.listeners('request')[0];