import { withFilter } from 'graphql-subscriptions';
import { ObjectId } from 'mongodb';
import checkAuth from '../../helpers/check-auth';
import { conversationParticipantProvider, conversationProvider } from '../indexes/providers.index';
import { MutationReadConversationArgs, MutationStartConversationArgs } from '../schema/types/schema';
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

    readConversation: async (_: Root, args: MutationReadConversationArgs, context: UserContext): Promise<boolean> => {
      const session = checkAuth(context);
      const { id: userId } = session.user;

      const input = { userId, ...args.input };

      return conversationParticipantProvider.readConversation(input);
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
      ): Promise<UnresolvedConversation> => {
        const session = checkAuth(context);
        const { id } = session.user;

        const userId = new ObjectId(id);
        const payloadConversationId = new ObjectId(payload.conversation.id);

        const isUserPartOfConversation = await conversationParticipantProvider.isParticipant(
          userId,
          payloadConversationId
        );

        if (!isUserPartOfConversation) {
          throw new Error('You are not part of this conversation');
        }

        return payload.conversation;
      },
    },
  },
};

export { conversationResolver };
