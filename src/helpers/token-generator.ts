import jwt from 'jsonwebtoken';

import config from '../../config';
import { TokenAuth } from './check-auth';

const generateToken = (account: TokenAuth): string => {
  return jwt.sign(
    {
      id: account.id,
      email: account.email,
    },
    config.SECRET_TOKEN_KEY,
    { expiresIn: '1h' } // can be bumped to 6h, once development starts on apps
  );
};

export default generateToken;
