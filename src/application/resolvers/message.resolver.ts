import { ExpressContext } from 'apollo-server-express';

import checkAuth from '../helpers/check-auth';
import { messageProvider } from '../providers';
import { Message, MutationReceiveMessageArgs, MutationSendMessageArgs } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const messageResolver = {
  Mutation: {
    async sendMessage(_: Root, args: MutationSendMessageArgs, context: ExpressContext): Promise<boolean> {
      const { id } = checkAuth(context);
      const input = { id, ...args.input };

      return messageProvider.sendMessage(input);
    },

    async receiveMessage(_: Root, args: MutationReceiveMessageArgs, context: ExpressContext): Promise<Message[]> {
      const { id } = checkAuth(context);
      const input = { id, ...args.input };

      return messageProvider.getMessages(input);
    },
  },
};

export { messageResolver };
