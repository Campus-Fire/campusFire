import { withFilter } from 'graphql-subscriptions';
import { ObjectId } from 'mongodb';
import { CFError } from '../../lib/errors-handler';
import checkAuth from '../../helpers/check-auth';
import { conversationParticipantProvider, conversationProvider, messageProvider } from '../indexes/providers.index';
import { Message, MutationSendMessageArgs, SubscriptionMessageSentArgs } from '../schema/types/schema';
import { Root, SubscriptionMessageSentPayload, UserContext } from '../schema/types/types';

const messageResolver = {
  Query: {
    messages: async (): Promise<Message[]> => {
      return messageProvider.getAllMessages();
    },
  },

  Mutation: {
    sendMessage: async (_: Root, args: MutationSendMessageArgs, context: UserContext): Promise<boolean> => {
      const { pubsub } = context;
      const session = checkAuth(context);
      const { id: userId } = session.user;

      const input = { userId, ...args.input };

      const message = await messageProvider.sendMessage(input);
      pubsub.publish('MESSAGE_SENT', { message });

      const conversation = await conversationProvider.updateLatestMessage(message);
      pubsub.publish('CONVERSATION_UPDATED', {
        conversation,
      });

      return message.conversationId.toHexString() === input.conversationId;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: Root, _args: any, context: UserContext) => {
          const { pubsub } = context;

          return pubsub.asyncIterator(['MESSAGE_SENT']);
        },
        async (payload: SubscriptionMessageSentPayload, args: SubscriptionMessageSentArgs, context: UserContext) => {
          const session = checkAuth(context);
          const { id } = session.user;

          const userId = new ObjectId(id);
          const payloadConversationId = new ObjectId(payload.message.conversationId);
          const isUserPartOfConversation = await conversationParticipantProvider.isParticipant(
            userId,
            payloadConversationId
          );

          const argsConversationId = new ObjectId(args.conversationId).toHexString();
          const isCorrectConversation = argsConversationId === payloadConversationId.toHexString();

          return isUserPartOfConversation && isCorrectConversation;
        }
      ),

      resolve: async (payload: SubscriptionMessageSentPayload, _args: any, context: UserContext): Promise<Message> => {
        const session = checkAuth(context);
        const { id } = session.user;

        const userId = new ObjectId(id);
        const payloadConversationId = new ObjectId(payload.message.conversationId);
        const isUserPartOfConversation = await conversationParticipantProvider.isParticipant(
          userId,
          payloadConversationId
        );

        if (!isUserPartOfConversation) {
          throw new CFError('WRONG_CONVERSATION');
        }

        return payload.message;
      },
    },
  },

  Conversation: {
    latestMessage: async (conversation: any): Promise<Message> => {
      return messageProvider.getMessageById(conversation.latestMessageId);
    },
  },
};

export { messageResolver };
