import { Collection, ObjectId } from 'mongodb';

import { validateStringInputs } from '../../../helpers/validator';
import { MessageDocument, toMessageObject } from '../../../entities/message.entity';
import { preferenceProvider, profileProvider } from '../../indexes/provider';
import { Message, ReceiveMessageInput, SendMessageInput } from './message.provider.types';

class MessageProvider {
  constructor(private collection: Collection<MessageDocument>) { }

  public async sendMessage(input: SendMessageInput): Promise<boolean> {
    const { id, from, to, text } = input;
    if (id !== from) {
      throw new Error('Authenticated user can not send message on be-half of other user');
    }

    const senderId = new ObjectId(from);
    if (!(await profileProvider.isUserActive(senderId))) {
      throw new Error('Sender is not an active user');
    }

    const receiverId = new ObjectId(to);
    if (!(await profileProvider.isUserActive(receiverId))) {
      throw new Error('Receiver is not an active user');
    }

    await preferenceProvider.areUsersMatched(senderId, receiverId);
    validateStringInputs(text);

    const data = await this.collection.insertOne({
      from: senderId,
      to: receiverId,
      text,
      at: new Date().toISOString(),
    });
    if (!data) {
      throw new Error('Unable to send a message');
    }

    return true;
  }

  public async getMessages(input: ReceiveMessageInput): Promise<Message[]> {
    const { id, user, oppUser } = input;
    if (id !== user) {
      throw new Error('Wrong user to see messages');
    }

    const userId = new ObjectId(user);
    if (!(await profileProvider.isUserActive(userId))) {
      throw new Error('Sender is not an active user');
    }

    const oppUserId = new ObjectId(oppUser);
    if (!(await profileProvider.isUserActive(oppUserId))) {
      throw new Error('Receiver is not an active user');
    }

    const messages = await this.collection
      .find({
        $or: [
          { from: userId, to: oppUserId },
          { from: oppUserId, to: userId },
        ],
      })
      .sort({ at: -1 })
      .toArray();

    return messages.map(toMessageObject);
  }
}

export { MessageProvider };
