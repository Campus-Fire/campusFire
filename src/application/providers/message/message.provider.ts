import { Collection, ObjectId } from 'mongodb';

import { profileProvider } from '../index';
import validateStringInputs from '../../../application/helpers/string-validator';
import { MessageDocument } from '../../../entities/message.entity';
import { SendMessageInput } from './message.provider.types';

class MessageProvider {
  constructor(private collection: Collection<MessageDocument>) {}

  public async sendMessage(input: SendMessageInput): Promise<boolean> {
    const { id, from, to, text } = input;

    if (id !== from) {
      throw new Error('Authenticated user can not send message on be-half of other user');
    }

    const senderId = new ObjectId(from);
    const receiverId = new ObjectId(to);

    validateStringInputs(text);

    if (!(await profileProvider.isUserActive(senderId))) {
      throw new Error('Sender is not an active user');
    }
    if (!(await profileProvider.isUserActive(receiverId))) {
      throw new Error('Receiver is not an active user');
    }

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
}

export { MessageProvider };
