import { ObjectId } from 'mongodb';
import { MessageReaction } from '../schema/types/schema';

export interface Message {
  id: ObjectId;
  senderId: ObjectId;
  body: string;
  conversationId: ObjectId;
  createdAt: Date;
  hasReaction: boolean;
  reaction?: MessageReaction;
}

export interface SendMessageInput {
  userId: ObjectId;
  conversationId: ObjectId;
  body: string;
}

export interface AddReactionInput {
  userId: ObjectId;
  messageId: ObjectId;
  reaction: MessageReaction;
}
