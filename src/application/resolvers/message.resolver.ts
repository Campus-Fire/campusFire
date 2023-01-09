import { withFilter } from 'graphql-subscriptions';
import { ObjectId } from 'mongodb';
import checkAuth from '../../helpers/check-auth';
import { conversationProvider, messageProvider } from '../indexes/provider';
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
      pubsub.publish('CONVERSATION_UPDATED', { conversation });

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
        (payload: SubscriptionMessageSentPayload, args: SubscriptionMessageSentArgs) => {
          const payloadConversationId = new ObjectId(payload.message.conversationId);
          const argsConversationId = new ObjectId(args.conversationId);

          return payloadConversationId.toHexString() === argsConversationId.toHexString();
        }
      ),

      resolve: async (payload: SubscriptionMessageSentPayload, _args: any): Promise<Message> => {
        return payload.message;
      },
    },
  },
};

export { messageResolver };
