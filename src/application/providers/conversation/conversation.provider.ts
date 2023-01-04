import { Collection, ObjectId } from 'mongodb';
import { conversationParticipantProvider } from '../../indexes/provider';
import { ConversationDocument, toConversationObject } from '../../../entities/conversation.entity';
import { Conversation, StartConversationInput } from './conversation.provider.types';

class ConversationProvider {
  constructor(private collection: Collection<ConversationDocument>) {}

  public async getAllConversations(): Promise<Conversation[]> {
    const conversations = await this.collection.find().toArray();

    return conversations.map(toConversationObject);
  }

  public async startConversation(input: StartConversationInput): Promise<string> {
    const { userId, participantIds } = input;
    let participants: ObjectId[] = [];

    const conversationId = new ObjectId();
    const senderId = new ObjectId(userId);
    participants.push(await conversationParticipantProvider.createParticipant(conversationId, senderId));

    for (let participantId of participantIds) {
      participants.push(
        await conversationParticipantProvider.createParticipant(conversationId, new ObjectId(participantId))
      );
    }

    const conversationData = await this.collection.insertOne({
      _id: conversationId,
      participantIds: participants,
      latestMessageId: null,
      updatedAt: new Date(),
    });
    if (!conversationData.insertedId) {
      throw new Error('Could not start a conversation');
    }

    participants.forEach(async (participant) => {
      await conversationParticipantProvider.setLatestMessageSeenStatus(
        conversationData.insertedId,
        senderId,
        participant
      );
    });

    return conversationData.insertedId.toHexString();
  }

  public async updateConversation(conversationId: ObjectId, senderId: ObjectId, messageId: ObjectId): Promise<void> {
    const convData = await this.collection.findOneAndUpdate(
      { _id: conversationId },
      {
        $set: {
          ...{ latestMessageId: messageId },
          ...{ updatedAt: new Date() },
        },
      },
      { returnDocument: 'after' }
    );
    if (!convData.value) {
      throw new Error('Could not notify other users');
    }

    for (let participant of convData.value.participantIds) {
      await conversationParticipantProvider.setLatestMessageSeenStatus(convData.value._id, senderId, participant);
    }
  }
}

export { ConversationProvider };
