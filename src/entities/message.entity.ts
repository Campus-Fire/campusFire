import { Document } from 'mongodb';

import { Message } from '../application/providers/message/message.provider.types';

interface MessageDocument extends Document, Message {}

const toMessageObject = (message: MessageDocument): Message => {
  return {
    from: message.from,
    to: message.to,
    text: message.text,
    at: message.at,
  };
};

export { MessageDocument, toMessageObject };
