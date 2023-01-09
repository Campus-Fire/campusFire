import jwt from 'jsonwebtoken';
import { AuthenticationError, ExpressContext } from 'apollo-server-express';
import config from '../../config';
import { SessionUser } from 'src/application/schema/types/types';

const generateToken = (account: SessionUser): string => {
  return jwt.sign(
    {
      id: account.id,
      email: account.email,
    },
    config.SECRET_TOKEN_KEY,
    { expiresIn: '168h' } // can be bumped to 6h, once development starts on apps
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
      try {
        const user = jwt.verify(token, config.SECRET_TOKEN_KEY);

        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }

    throw new AuthenticationError('Authentication header must be in "Bearer <token>" format');
  }

  throw new AuthenticationError('Authentication headers are not provided');
};

export { generateToken, generateResetPasswortToken, getSessionUser };
