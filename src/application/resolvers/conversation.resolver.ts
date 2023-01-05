import { withFilter } from 'graphql-subscriptions';
import checkAuth from '../../helpers/check-auth';
import { conversationProvider } from '../indexes/provider';
import { MutationStartConversationArgs } from '../schema/types/schema';
import {
  Root,
  SubscriptionConversationUpdatedPayload,
  UnresolvedConversation,
  UserContext,
} from '../schema/types/types';

const conversationResolver = {
  Query: {
    conversations: async (): Promise<UnresolvedConversation[]> => {
      return conversationProvider.getAllConversations();
    },
  },

  Mutation: {
    startConversation: async (_: Root, args: MutationStartConversationArgs, context: UserContext): Promise<string> => {
      const session = checkAuth(context);
      const { id: userId } = session.user;
      args.input.participantIds.push(userId);

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
        async (payload: SubscriptionConversationUpdatedPayload, _args: any, context: UserContext): Promise<boolean> => {
          const session = checkAuth(context);
          const { id: userId } = session.user;

          console.log(payload.conversation);

          const res = await conversationProvider.isConversationUpdated(userId, payload.conversation.id);

          console.log('waiting');
          console.log(res);

          return res;
        }
      ),

      resolve: async (
        payload: SubscriptionConversationUpdatedPayload,
        _args: any,
        context: UserContext
      ): Promise<UnresolvedConversation> => {
        return payload.conversation;
      },
    },
  },
};

export { conversationResolver };
