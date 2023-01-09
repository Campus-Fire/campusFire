import { AuthenticationError } from 'apollo-server-express';
import { ObjectId } from 'mongodb';

import { Session, UserContext } from '../application/schema/types/types';
import deterministicId from './deterministic-id';

const checkAuth = (context: UserContext): Session => {
  const { session } = context;

  if (!session || !session.user) {
    throw new Error('Invalid/Expired Session');
  }

  const derivedId = deterministicId(session.user.email).toString();
  const userId = new ObjectId(session.user.id).toString();

  if (userId !== derivedId) {
    throw new AuthenticationError('Invalid/Expired token');
  }

  return session;
};

export default checkAuth;
