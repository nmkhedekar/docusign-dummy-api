const UnauthenticatedError = require('./unauthenticated');
const NotFoundError = require('./not-found');
const BadRequestError = require('./bad-request');
const UnauthorizedError = require('./unauthorized');

module.exports = {  
  UnauthenticatedError,
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
};