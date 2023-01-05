import { conversationParticipantProvider } from '../indexes/provider';
import { ConversationParticipant } from '../schema/types/schema';

const conversationParticipantResolver = {
  Conversation: {
    participants: async (conversation: any): Promise<ConversationParticipant[]> => {
      return conversationParticipantProvider.getParticipantsByIds(conversation.participantIds);
    },
  },
};

export { conversationParticipantResolver };
