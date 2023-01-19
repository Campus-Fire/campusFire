import { ObjectId } from 'mongodb';

interface ConversationParticipant {
  id: ObjectId;
  userId: ObjectId;
  conversationId: ObjectId;
  hasSeenLatestMessage: boolean;
  createdAt: Date;
}

interface Conversation {
  id: ObjectId;
  participantIds: ObjectId[];
  latestMessageId?: ObjectId;
  updatedAt: Date;
}

interface StartConversationInput {
  userId: ObjectId;
  participantIds: ObjectId[];
}

interface ReadConversationInput {
  userId: ObjectId;
  conversationId: ObjectId;
}

export { Conversation, ConversationParticipant, StartConversationInput, ReadConversationInput };
