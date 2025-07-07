import jwt from 'jsonwebtoken';

const jwtUtils = {
  sign: (payload, secret) => {
    return jwt.sign(payload, secret, { expiresIn: '2h' });
  },
  verify: (token, secret) => {
    return jwt.verify(token, secret);
  }
};

export default jwtUtils; 