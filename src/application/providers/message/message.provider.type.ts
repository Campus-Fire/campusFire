import { ObjectId } from 'mongodb';

interface Message {
  id: ObjectId;
  senderId: ObjectId;
  body: string;
  conversationId: ObjectId;
  createdAt: Date;
}

interface SendMessageInput {
  userId: ObjectId;
  conversationId: ObjectId;
  body: string;
}

export { Message, SendMessageInput };
