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
    { expiresIn: '168h' } // can be bumped to 6h, once development starts on apps
  );
};

const generateResetPasswortToken = (account: TokenAuth): string => {
  return jwt.sign(
    {
      id: account.id,
      email: account.email,
    },
    config.RESET_PASSWORD_KEY,
    { expiresIn: '24h' }
  )
}

export { generateToken, generateResetPasswortToken };
