import { ExpressContext } from 'apollo-server-express';

import checkAuth from '../helpers/check-auth';
import { messageProvider } from '../providers';
import { MutationSendMessageArgs } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const messageResolver = {
  Mutation: {
    async sendMessage(_: Root, args: MutationSendMessageArgs, context: ExpressContext): Promise<boolean> {
      const { id } = checkAuth(context);
      const input = { id, ...args.input };

      return messageProvider.sendMessage(input);
    },
  },
};

export { messageResolver };
