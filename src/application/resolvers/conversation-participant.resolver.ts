import checkAuth from '../../helpers/check-auth';
import { conversationParticipantProvider } from '../indexes/providers.index';
import { ConversationParticipant, MutationReadConversationArgs } from '../schema/types/schema';
import { Root, UnresolvedConversation, UserContext } from '../schema/types/types';

const conversationParticipantResolver = {
  Mutation: {
    readConversation: async (_: Root, args: MutationReadConversationArgs, context: UserContext): Promise<boolean> => {
      const session = checkAuth(context);
      const { id: userId } = session.user;
      const input = { userId, ...args.input };

      return conversationParticipantProvider.readConversation(input);
    },
  },

  Conversation: {
    startingParticipant: async (conversation: UnresolvedConversation): Promise<ConversationParticipant> => {
      return conversationParticipantProvider.getParticipantById(conversation.startedBy);
    },

    acceptingParticipant: async (conversation: UnresolvedConversation): Promise<ConversationParticipant> => {
      return conversationParticipantProvider.getParticipantById(conversation.participant);
    },
  },
};

export { conversationParticipantResolver };
