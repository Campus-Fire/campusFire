import { PubSub } from 'graphql-subscriptions';
import { ObjectId } from 'mongodb';
import { Conversation, Message } from './schema';

export interface Root {}

export interface SessionUser {
  id: any;
  email: any;
}

export interface Session {
  user: SessionUser;
}

export interface UserContext {
  pubsub: PubSub;
  session: Session | null;
}

export interface SubscriptionMessageSentPayload {
  message: Message;
}

export interface SubscriptionConversationUpdatedPayload {
  conversation: Conversation;
}

export interface UnresolvedConversation extends Omit<Conversation, 'participants' | 'latestMessage'> {
  participantIds?: ObjectId[];
  latestMessageId?: ObjectId;
}
