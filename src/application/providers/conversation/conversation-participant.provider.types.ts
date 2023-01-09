import { ObjectId } from 'mongodb';

interface ConversationParticipant {
  id: ObjectId;
  userId: ObjectId;
  conversationId: ObjectId;
  hasSeenLatestMessage: boolean;
  createdAt: Date;
}

export { ConversationParticipant };
