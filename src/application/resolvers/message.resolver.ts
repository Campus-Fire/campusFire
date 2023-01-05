import { withFilter } from 'graphql-subscriptions';
import { ObjectId } from 'mongodb';
import checkAuth from '../../helpers/check-auth';
import { SubscriptionContext } from '../../server';
import { messageProvider } from '../indexes/provider';
import { Message, MutationSendMessageArgs, SubscriptionMessageSentArgs } from '../schema/types/schema';
import { Root, SendMessagePayload } from '../schema/types/types';

const messageResolver = {
  Query: {
    async messages(): Promise<Message[]> {
      return messageProvider.getAllMessages();
    },
  },

  Mutation: {
    async sendMessage(_: Root, args: MutationSendMessageArgs, context: SubscriptionContext): Promise<boolean> {
      const { pubsub } = context;

      console.log(`resolver pubsub - ${pubsub}`);

      const { id: userId } = checkAuth(context);

      const input = { userId, ...args.input };

      const message = await messageProvider.sendMessage(input);
      pubsub.publish('MESSAGE_SENT', { message });

      return message.conversationId.toHexString() === input.conversationId;
    },
  },

  Subscription: {
    messageSent: {
      subscribe: withFilter(
        (_: Root, args: any, context: SubscriptionContext) => {
          const { pubsub } = context;
          console.log('FIRST_FN');
          return pubsub.asyncIterator(['MESSAGE_SENT']);
        },
        (payload: SendMessagePayload, args: SubscriptionMessageSentArgs, context: SubscriptionContext) => {
          console.log('SECOND_FN');
          console.log(payload.message.conversationId);
          console.log(args.conversationId);

          const payloadConversationId = new ObjectId(payload.message.conversationId);
          const argsConversationId = new ObjectId(args.conversationId);

          return payloadConversationId.toHexString() === argsConversationId.toHexString();
        }
      ),

      resolve: async (payload: SendMessagePayload) => {
        return payload.message;
      },
    },
  },
};

export { messageResolver };
