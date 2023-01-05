import { Collection, ObjectId } from 'mongodb';
import { profileProvider } from '../../../application/indexes/provider';
import { ConversationParticipantDocument } from '../../../entities/conversation-participant.entity';

class ConversationParticipantProvider {
  constructor(private collection: Collection<ConversationParticipantDocument>) {}

  public async createParticipant(convoId: ObjectId, userId: ObjectId): Promise<ObjectId> {
    await profileProvider.isUserActive(userId);

    const participantData = await this.collection.insertOne({
      _id: new ObjectId(),
      userId,
      conversationId: convoId,
      hasSeenLatestMessage: false,
      createdAt: new Date(),
    });
    if (!participantData.insertedId) {
      throw new Error('Unable to add the user to conversation');
    }

    return participantData.insertedId;
  }

  public async setLatestMessageSeenStatus(
    conversationId: ObjectId,
    senderId: ObjectId,
    participantId: ObjectId
  ): Promise<void> {
    const userId = await this.getParticipantsUserId(participantId);
    const hasSeenLastMessage = senderId.toHexString() === userId.toHexString();

    const participantData = await this.collection.findOneAndUpdate(
      { userId: userId, conversationId: conversationId },
      { $set: { ...{ hasSeenLatestMessage: hasSeenLastMessage } } },
      { returnDocument: 'after' }
    );
    if (!participantData) {
      throw new Error('Unable to deliver message in conversation');
    }
  }

  public async getParticipantsUserId(participantId: ObjectId): Promise<ObjectId> {
    const data = await this.collection.findOne({ _id: participantId });
    if (!data) {
      throw new Error('Unable to find user');
    }

    return data.userId;
  }
}

export { ConversationParticipantProvider };
