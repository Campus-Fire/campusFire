import { AuthenticationError, ExpressContext } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import config from '../../config';

const checkAuth = (context: ExpressContext): any => {
  const authHeaders = context.req.headers.authorization;
  if (authHeaders) {
    // Bearer .....
    const headerParts = authHeaders.split(' ');

    const token = headerParts[1];
    const bearer = headerParts[0];
    if (bearer === 'Bearer') {
      try {
        const account = jwt.verify(token, config.SECRET_TOKEN_KEY);

        return account;
      } catch (err) {
        throw new AuthenticationError('Invalid/Expired token');
      }
    }

    throw new AuthenticationError('Authentication header must be in "Bearer <token>" format');
  }

  throw new AuthenticationError('Authentication headers are not provided');
};

export default checkAuth;
