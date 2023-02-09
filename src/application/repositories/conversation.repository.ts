import { Document } from 'mongodb';
import { Conversation } from '../models/conversation.model';

interface ConversationDocument extends Document, Omit<Conversation, 'id'> {}

const toConversationObject = (conversation: ConversationDocument): Conversation => {
  return {
    id: conversation._id.toHexString(),
    startedBy: conversation.startedBy,
    participant: conversation.participant,
    latestMessage: conversation.latestMessage,
    isConversationRequest: conversation.isConversationRequest,
    updatedAt: conversation.updatedAt,
  };
};

export { ConversationDocument, toConversationObject };
