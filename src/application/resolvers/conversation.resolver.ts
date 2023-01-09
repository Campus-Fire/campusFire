import { withFilter } from 'graphql-subscriptions';
import checkAuth from '../../helpers/check-auth';
import { conversationProvider } from '../indexes/provider';
import { Conversation, MutationStartConversationArgs } from '../schema/types/schema';
import { Root, SubscriptionConversationUpdatedPayload, UserContext } from '../schema/types/types';

const conversationResolver = {
  Query: {
    conversations: async (): Promise<Conversation[]> => {
      return conversationProvider.getAllConversations();
    },
  },

  Mutation: {
    startConversation: async (_: Root, args: MutationStartConversationArgs, context: UserContext): Promise<string> => {
      const session = checkAuth(context);
      const { id: userId } = session.user;

      const input = { userId, ...args.input };

      return conversationProvider.startConversation(input);
    },
  },

  Subscription: {
    conversationUpdated: {
      subscribe: withFilter(
        (_: Root, _args: any, context: UserContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(['CONVERSATION_UPDATED']);
        },
        (payload: SubscriptionConversationUpdatedPayload, _args: any, context: UserContext) => {
          const session = checkAuth(context);
          const { id: userId } = session.user;

          console.log(session);

          return true;
        }
      ),

      resolve: async (payload: SubscriptionConversationUpdatedPayload, _args: any, context: UserContext) => {
        checkAuth(context);

        console.log('RESOLVER');

        return payload.conversation;
      },
    },
  },
};

export { conversationResolver };
