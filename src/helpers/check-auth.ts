import { ObjectId } from 'mongodb';
import { CFError } from '../lib/errors-handler';

import { Session, UserContext } from '../application/schema/types/types';
import deterministicId from './deterministic-id';

const checkAuth = (context: UserContext): Session => {
  const { session } = context;

  if (!session || !session.user) {
    throw new CFError('INVALID_SESSION');
  }

  const derivedId = deterministicId(session.user.email).toString();
  const userId = new ObjectId(session.user.id).toString();

  if (userId !== derivedId) {
    throw new CFError('INVALID_TOKEN');
  }

  return session;
};

export default checkAuth;
