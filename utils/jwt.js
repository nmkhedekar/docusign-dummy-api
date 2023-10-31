const jwt = require('jsonwebtoken');

const createJWT = ({ payload }) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = jwt.sign(payload, JWT_SECRET);
  return token;
};

const isTokenValid = (token) => {
  console.log("token", token);
  const JWT_SECRET = process.env.JWT_SECRET;
  const resp = jwt.verify(token, JWT_SECRET)
  console.log("jwtResp", resp);
  return resp;
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  console.log("accessTokenJWT", accessTokenJWT);
  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true, // used to get on http request
    // secure: NODE_ENV === 'development',//it should be secured so not get exposed to anywhere
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    // secure: NODE_ENV === 'development',
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });

  return { accessTokenJWT, refreshTokenJWT }
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
};