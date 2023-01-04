import { Document } from 'mongodb';
import { Message } from '../application/providers/message/message.provider.type';

interface MessageDocument extends Document, Omit<Message, 'id'> {}

const toMessageObject = (message: MessageDocument): Message => {
  return {
    id: message._id.toHexString(),
    senderId: message.senderId,
    body: message.body,
    conversationId: message.conversationId,
    createdAt: message.createdAt,
  };
};

export { MessageDocument, toMessageObject };
