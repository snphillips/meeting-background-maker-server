const serverless = require('serverless-http');
const app = require('../../index'); // adjust path to your server entry file
module.exports.handler = serverless(app);