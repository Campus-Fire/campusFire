import { Collection, ObjectId } from 'mongodb';
import { MessageDocument, toMessageObject } from '../../../entities/message.entity';
import { validateStringInputs } from '../../../helpers/validator';
import { conversationProvider } from '../../indexes/provider';
import { Message, SendMessageInput } from './message.provider.type';

class MessageProvider {
  constructor(private collection: Collection<MessageDocument>) {}

  public async getAllMessages(): Promise<Message[]> {
    const messages = await this.collection.find().toArray();

    return messages.map(toMessageObject);
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
    const messageData = await this.collection.findOne({ _id: messageId });
    if (!messageData) {
      throw new Error('Unable to find the message');
    }

    return messageData.senderId.toHexString() === userId.toHexString();
  }
}

export { MessageProvider };
