import { Collection, ObjectId } from 'mongodb';
import { MessageDocument, toMessageObject } from '../repositories/message.repository';
import { validateStringInputs } from '../../helpers/validator';
import { Message, SendMessageInput } from '../models/message.model';

class MessageProvider {
  constructor(private collection: Collection<MessageDocument>) {}

  public async getAllMessages(): Promise<Message[]> {
    const messages = await this.collection.find().toArray();

    return messages.map(toMessageObject);
  }

  public async getMessageById(messageId: ObjectId): Promise<Message> {
    const id = new ObjectId(messageId);

    const messageData = await this.collection.findOne({ _id: id });
    if (!messageData) {
      throw new Error('Message not found!');
    }

    return toMessageObject(messageData);
  }

  public async sendMessage(input: SendMessageInput): Promise<Message> {
    const { userId, conversationId: convoId, body } = input;

    const senderId = new ObjectId(userId);
    const conversationId = new ObjectId(convoId);
    const messageId = new ObjectId();

    validateStringInputs(body);

    const messageData = await this.collection.insertOne({
      _id: messageId,
      senderId,
      body,
      conversationId,
      createdAt: new Date(),
    });
    if (!messageData.insertedId) {
      throw new Error('Could not send message');
    }

    const message = await this.collection.findOne({ _id: messageData.insertedId });
    if (!message) {
      throw new Error('Can not send message');
    }

    return toMessageObject(message);
  }

  public async isSender(userId: ObjectId, messageId: ObjectId): Promise<boolean> {
    const id = new ObjectId(messageId);
    const messageData = await this.collection.findOne({ _id: id });
    if (!messageData) {
      throw new Error('Unable to find the message');
    }

    return messageData.senderId.toHexString() === userId.toHexString();
  }
}

export { MessageProvider };
