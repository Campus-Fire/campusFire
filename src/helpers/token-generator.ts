import jwt from 'jsonwebtoken';
import config from '../../config';

const generateToken = (account: { id: any; email: any }): string => {
  return jwt.sign(
    {
      id: account.id,
      email: account.email,
    },
    config.SECRET_TOKEN_KEY,
    { expiresIn: '1h' }
  );
};

export default generateToken;
