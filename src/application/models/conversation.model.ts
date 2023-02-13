import { ObjectId } from 'mongodb';

export interface ConversationParticipant {
  id: ObjectId;
  userId: ObjectId;
  conversationId: ObjectId;
  hasSeenLatestMessage: boolean;
  createdAt: Date;
}

export interface Conversation {
  id: ObjectId;
  startedBy: ObjectId;
  participant: ObjectId;
  latestMessageId: ObjectId;
  isConversationRequest: boolean;
  updatedAt: Date;
}

export interface AcceptConversationRequestInput {
  userId: ObjectId;
  conversationId: ObjectId;
}

export interface ReadConversationInput {
  userId: ObjectId;
  conversationId: ObjectId;
}

export interface SendConversationRequestInput {
  userId: ObjectId;
  participantId: ObjectId;
  requestMessage: string;
}
