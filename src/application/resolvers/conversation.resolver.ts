import { withFilter } from 'graphql-subscriptions';
import { ObjectId } from 'mongodb';
import checkAuth from '../../helpers/check-auth';
import { CFError } from '../../lib/errors-handler';
import { conversationProvider } from '../indexes/providers.index';
import {
  Conversation,
  MutationAcceptConversationRequestArgs,
  MutationSendConversationRequestArgs,
} from '../schema/types/schema';
import {
  Root,
  SubscriptionConversationUpdatedPayload,
  UnresolvedConversation,
  UserContext,
} from '../schema/types/types';

const conversationResolver = {
  Query: {
    getConversationRequests: async (_: Root, __: any, context: UserContext): Promise<UnresolvedConversation[]> => {
      const session = checkAuth(context);
      const { id: userId } = session.user.id;

      return conversationProvider.getUserConversationRequests(userId);
    },

    userConversations: async (_: Root, __: any, context: UserContext): Promise<UnresolvedConversation[]> => {
      const session = checkAuth(context);
      const { id: userId } = session.user;

      return conversationProvider.getUserConversations(userId);
    },
  },

  Mutation: {
    sendConversationRequest: async (
      _: Root,
      args: MutationSendConversationRequestArgs,
      context: UserContext
    ): Promise<string> => {
      const session = checkAuth(context);
      const { id: userId } = session.user;

      const input = { userId, ...args.input };

      return conversationProvider.sendConversationRequest(input);
    },

    acceptConversationRequest: async (
      _: Root,
      args: MutationAcceptConversationRequestArgs,
      context: UserContext
    ): Promise<boolean> => {
      const session = checkAuth(context);
      const { id: userId } = session.user;

      const input = { userId, ...args.input };

      return conversationProvider.acceptConversationRequest(input);
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

          const isConversationUpdated = await conversationProvider.isConversationUpdated(
            userId,
            payload.conversation.id
          );

          return isConversationUpdated;
        }
      ),
      resolve: async (
        payload: SubscriptionConversationUpdatedPayload,
        _args: any,
        context: UserContext
      ): Promise<Conversation> => {
        const session = checkAuth(context);
        const { id } = session.user;

        const userId = new ObjectId(id);
        const payloadConversationId = new ObjectId(payload.conversation.id);

        const isConversationUpdated = await conversationProvider.isConversationUpdated(userId, payloadConversationId);
        if (!isConversationUpdated) {
          throw new CFError('WRONG_CONVERSATION');
        }

        return payload.conversation;
      },
    },
  },
};

export { conversationResolver };
