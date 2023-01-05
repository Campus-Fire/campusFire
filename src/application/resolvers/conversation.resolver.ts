import checkAuth from '../../helpers/check-auth';
import { conversationProvider } from '../indexes/provider';
import { Conversation, MutationStartConversationArgs } from '../schema/types/schema';
import { Root, UserContext } from '../schema/types/types';

const conversationResolver = {
  Query: {
    conversations: async (): Promise<Conversation[]> => {
      return conversationProvider.getAllConversations();
    },
  },

  Mutation: {
    startConversation: async (_: Root, args: MutationStartConversationArgs, context: UserContext): Promise<string> => {
      const { user } = checkAuth(context);
      const userId = user.id;
      const input = { userId, ...args.input };

      return conversationProvider.startConversation(input);
    },
  },
};

export { conversationResolver };
