import jwt from 'jsonwebtoken';
import config from '../../config';
import { SessionUser } from 'src/application/schema/types/types';
import { CFError } from '../lib/errors-handler';

const generateToken = (account: SessionUser): string => {
  return jwt.sign(
    {
      id: account.id,
      email: account.email,
    },
    config.SECRET_TOKEN_KEY,
    { expiresIn: '168h' } // can be bumped to 6d, once development starts on apps
  );
};

const generateResetPasswortToken = (account: SessionUser): string => {
  return jwt.sign(
    {
      id: account.id,
      email: account.email,
    },
    config.SECRET_TOKEN_KEY,
    { expiresIn: '1h' }
  );
};

const getSessionUser = (authHeaders: any): any => {
  if (authHeaders) {
    // Bearer .....
    const headerParts = authHeaders.split(' ');

    const token = headerParts[1];
    const bearer = headerParts[0];
    if (bearer === 'Bearer') {
      return verifyJWToken(token);
    }

    throw new CFError('INVALID_TOKEN');
  }

  throw new CFError('INVALID_SESSION');
};

const verifyJWToken = (token: string): any => {
  try {
    const user = jwt.verify(token, config.SECRET_TOKEN_KEY);

    return user;
  } catch (err) {
    throw new CFError('INVALID_TOKEN');
  }
};

export { generateToken, generateResetPasswortToken, getSessionUser, verifyJWToken };
