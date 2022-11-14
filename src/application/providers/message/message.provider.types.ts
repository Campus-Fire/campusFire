import { ObjectId } from 'mongodb';

interface Message {
  from: ObjectId;
  to: ObjectId;
  text: string;
  at: string;
}

interface SendMessageInput {
  from: ObjectId;
  to: ObjectId;
  text: string;
  id: ObjectId;
}

export { Message, SendMessageInput };
