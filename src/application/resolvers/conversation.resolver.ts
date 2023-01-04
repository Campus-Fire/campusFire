import { ExpressContext } from 'apollo-server-express';
import checkAuth from '../../helpers/check-auth';
import { conversationProvider } from '../indexes/provider';
import { Conversation, MutationStartConversationArgs } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const conversationResolver = {
  Query: {
    async conversations(): Promise<Conversation[] | null> {
      return conversationProvider.getAllConversations();
    },
  },

  Mutation: {
    async startConversation(_: Root, args: MutationStartConversationArgs, context: ExpressContext): Promise<string> {
      const { id: userId } = checkAuth(context);
      const input = { userId, ...args.input };

      return conversationProvider.startConversation(input);
    },
  },
};

export { conversationResolver };
