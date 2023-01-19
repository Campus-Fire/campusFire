import { Document } from 'mongodb';
import { Conversation } from '../models/conversation.model';

interface ConversationDocument extends Document, Omit<Conversation, 'id'> {}

const toConversationObject = (conversation: ConversationDocument): Conversation => {
  return {
    id: conversation._id.toHexString(),
    participantIds: conversation.participantIds,
    latestMessageId: conversation.latestMessageId,
    updatedAt: conversation.updatedAt,
  };
};

export { ConversationDocument, toConversationObject };