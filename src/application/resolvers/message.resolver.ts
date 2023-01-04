import { ExpressContext } from 'apollo-server-express';
import checkAuth from '../../helpers/check-auth';
import { messageProvider } from '../indexes/provider';
import { Message, MutationSendMessageArgs } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const messageResolver = {
  Query: {
    async messages(): Promise<Message[]> {
      return messageProvider.getAllMessages();
    },
  },

  Mutation: {
    async sendMessage(_: Root, args: MutationSendMessageArgs, context: ExpressContext): Promise<boolean> {
      const { id: userId } = checkAuth(context);
      const input = { userId, ...args.input };

      return messageProvider.sendMessage(input);
    },
  },
};

export { messageResolver };
