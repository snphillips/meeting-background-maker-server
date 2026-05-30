const serverless = require('serverless-http');
const app = require('../../server'); // adjust path to your server entry file
module.exports.handler = serverless(app);