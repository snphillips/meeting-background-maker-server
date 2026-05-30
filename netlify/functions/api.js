const serverless = require('serverless-http');
const app = require('../../server');

const handler = serverless(app);

module.exports.handler = async (event, context) => {
  console.log('Incoming path:', event.path);
  console.log('HTTP method:', event.httpMethod);
  return handler(event, context);
};