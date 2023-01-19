import { Collection, ObjectId } from 'mongodb';
import { MessageDocument, toMessageObject } from '../repositories/message.repository';
import { validateStringInputs } from '../../helpers/validator';
import { Message, SendMessageInput } from '../models/message.model';
import { CFError } from '../../lib/errors-handler';

class MessageProvider {
  constructor(private collection: Collection<MessageDocument>) {}

  public async getConversationMessages(conversationId: ObjectId): Promise<Message[]> {
    const convoId = new ObjectId(conversationId);
    const messages = await this.collection.find({ conversationId: convoId }).toArray();

    return messages.map(toMessageObject);
  }

  public async getMessageById(messageId: ObjectId): Promise<Message> {
    const id = new ObjectId(messageId);

    const messageData = await this.collection.findOne({ _id: id });
    if (!messageData) {
      throw new CFError('MESSAGE_NOT_FOUND');
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
      throw new CFError('MESSAGE_NOT_SENT');
    }

    const message = await this.collection.findOne({ _id: messageData.insertedId });
    if (!message) {
      throw new CFError('MESSAGE_NOT_SENT');
    }

    return toMessageObject(message);
  }

  public async isSender(userId: ObjectId, messageId: ObjectId): Promise<boolean> {
    const id = new ObjectId(messageId);
    const messageData = await this.collection.findOne({ _id: id });
    if (!messageData) {
      throw new CFError('MESSAGE_NOT_FOUND');
    }

    return messageData.senderId.toHexString() === userId.toHexString();
  }
}

export { MessageProvider };
