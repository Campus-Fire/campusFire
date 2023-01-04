import { ObjectId } from 'mongodb';

interface Conversation {
  id: ObjectId;
  participantIds: ObjectId[];
  latestMessageId?: ObjectId | null;
  updatedAt: Date;
}

interface StartConversationInput {
  userId: ObjectId;
  participantIds: ObjectId[];
}

export { Conversation, StartConversationInput };
