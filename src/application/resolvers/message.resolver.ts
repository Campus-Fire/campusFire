import { withFilter } from 'graphql-subscriptions';
import { ObjectId } from 'mongodb';
import checkAuth from '../../helpers/check-auth';
import { messageProvider } from '../indexes/provider';
import { Message, MutationSendMessageArgs, SubscriptionMessageSentArgs } from '../schema/types/schema';
import { Root, SendMessagePayload, UserContext } from '../schema/types/types';

const messageResolver = {
  Query: {
    messages: async (): Promise<Message[]> => {
      return messageProvider.getAllMessages();
    },
  },

  Mutation: {
    sendMessage: async (_: Root, args: MutationSendMessageArgs, context: UserContext): Promise<boolean> => {
      const { pubsub } = context;
      const { user } = checkAuth(context);
      const userId = user.id;
      const input = { userId, ...args.input };

      const message = await messageProvider.sendMessage(input);
      pubsub.publish('MESSAGE_SENT', { message });

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
        (payload: SendMessagePayload, args: SubscriptionMessageSentArgs) => {
          const payloadConversationId = new ObjectId(payload.message.conversationId);
          const argsConversationId = new ObjectId(args.conversationId);

          return payloadConversationId.toHexString() === argsConversationId.toHexString();
        }
      ),

      resolve: async (payload: SendMessagePayload, _args: any, context: UserContext): Promise<Message> => {
        return payload.message;
      },
    },
  },
};

export { messageResolver };
