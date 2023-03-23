import { Document } from 'mongodb';
import { Message } from '../models/message.model';

interface MessageDocument extends Document, Omit<Message, 'id'> {}

const toMessageObject = (message: MessageDocument): Message => {
  return {
    id: message._id.toHexString(),
    senderId: message.senderId,
    body: message.body,
    conversationId: message.conversationId,
    createdAt: message.createdAt,
    hasReaction: message.hasReaction,
    reaction: message.reaction,
  };
};

export { MessageDocument, toMessageObject };
