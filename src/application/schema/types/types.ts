import { PubSub } from 'graphql-subscriptions';
import { Conversation, Message } from './schema';

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

interface SubscriptionMessageSentPayload {
  message: Message;
}

interface SubscriptionConversationUpdatedPayload {
  conversation: Conversation;
}

export {
  Root,
  Session,
  SessionUser,
  UserContext,
  SubscriptionMessageSentPayload,
  SubscriptionConversationUpdatedPayload,
};
