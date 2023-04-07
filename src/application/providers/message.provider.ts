import { Collection, ObjectId } from 'mongodb';
import { validateStringInputs } from '../../helpers/validator';
import { CFError } from '../../lib/errors-handler';
import { AddReactionInput, Message, SendMessageInput } from '../models/message.model';
import { MessageDocument, toMessageObject } from '../repositories/message.repository';

class MessageProvider {
  constructor(private collection: Collection<MessageDocument>) {}

  public async getConversationMessages(conversationId: ObjectId): Promise<Message[]> {
    const convoId = new ObjectId(conversationId);
    const messages = await this.collection.find({ conversationId: convoId }).sort({ createdAt: 1 }).toArray();

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
    const messageBody = body.trim();

    const messageData = await this.collection.insertOne({
      _id: messageId,
      senderId,
      body: messageBody,
      conversationId,
      createdAt: new Date(),
      hasReaction: false,
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

  public async addReaction(input: AddReactionInput): Promise<Message> {
    const { messageId, reaction } = input;

    const msgId = new ObjectId(messageId);

    const messageData = await this.collection.findOneAndUpdate(
      { _id: msgId },
      {
        $set: {
          ...{ hasReaction: true },
          ...{ reaction: reaction },
        },
      },
      { returnDocument: 'after' }
    );
    if (!messageData.value) {
      throw new CFError('MESSAGE_NOT_FOUND');
    }

    return toMessageObject(messageData.value);
  }
}

export { MessageProvider };
