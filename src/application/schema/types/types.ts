import { PubSub } from 'graphql-subscriptions';
import { Message } from './schema';

interface Root {}

interface SessionUser {
  id: any;
  email: any;
}

interface Session {
  user: SessionUser;
}

interface UserContext {
  pubsub: PubSub;
  session: Session | null;
}

interface SendMessagePayload {
  message: Message;
}

export { Root, Session, SessionUser, UserContext, SendMessagePayload };
