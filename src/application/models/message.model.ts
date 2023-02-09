import { ObjectId } from 'mongodb';

export interface Message {
  id: ObjectId;
  senderId: ObjectId;
  body: string;
  conversationId: ObjectId;
  createdAt: Date;
}

export interface SendMessageInput {
  userId: ObjectId;
  conversationId: ObjectId;
  body: string;
}
