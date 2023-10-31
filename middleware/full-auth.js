const CustomError = require('../errors/index');
const { isTokenValid } = require('../utils/index');

const authenticateUser = async (req, res, next) => {
  let token;
  // check header
  const authHeader = req.headers.authorization;
  console.log("auth", authHeader);
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
    console.log("token", token)
  }
  // check cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {        
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
  try {
    const payload = isTokenValid(token);
    console.log("payload", payload);
    // Attach the user and his permissions to the req object
    req.user = {
      name: payload.user.name,
      userId: payload.user.userId,
      role: payload.user.role,
      stripe_customer_id: payload.user.stripe_customer_id
    };

    next();
  } catch (error) {    
    throw new CustomError.UnauthenticatedError('Authentication invalid');
  }
};

const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {        
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = { authenticateUser, authorizePermissions };
