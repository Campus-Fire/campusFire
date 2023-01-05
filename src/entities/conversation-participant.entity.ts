import { Document } from 'mongodb';
import { ConversationParticipant } from '../application/providers/conversation/conversation-participant.provider.types';

interface ConversationParticipantDocument extends Document, Omit<ConversationParticipant, 'id'> {}

const toConversationParticipantObject = (participant: ConversationParticipantDocument): ConversationParticipant => {
  return {
    id: participant._id.toHexString(),
    userId: participant.userId,
    conversationId: participant.conversationId,
    hasSeenLatestMessage: participant.hasSeenLatestMessage,
    createdAt: participant.createdAt,
  };
};

export { ConversationParticipantDocument, toConversationParticipantObject };