import { AuthenticationError, ExpressContext } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

import { SubscriptionContext } from 'src/server';
import config from '../../config';
import deterministicId from './deterministic-id';

export interface TokenAuth {
  id: any;
  email: any;
}

const verifyToken = (context: ExpressContext | SubscriptionContext): any => {
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

const checkAuth = (context: ExpressContext | SubscriptionContext): TokenAuth => {
  const { id, email } = verifyToken(context);

  const derivedId = deterministicId(email).toString();
  const userId = new ObjectId(id).toString();

  if (userId !== derivedId) {
    throw new AuthenticationError('Invalid/Expired token');
  }

  return { id, email };
};

export default checkAuth;
