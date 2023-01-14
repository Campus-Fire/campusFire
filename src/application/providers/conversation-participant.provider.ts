import { Collection, ObjectId } from 'mongodb';
import { profileProvider } from '../indexes/providers.index';
import {
  ConversationParticipantDocument,
  toConversationParticipantObject,
} from '../repositories/conversation-participant.repository';
import { ConversationParticipant, ReadConversationInput } from '../models/conversation.model';

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

  public async isParticipant(userId: ObjectId, conversationId: ObjectId): Promise<boolean> {
    const participantData = await this.collection.findOne({ userId: userId, conversationId: conversationId });
    if (!participantData) {
      return false;
    }

    return true;
  }

  public async getParticipantsByIds(participantIds: ObjectId[]): Promise<ConversationParticipant[]> {
    const participantObjIds = participantIds.map((participantId) => new ObjectId(participantId));

    const participants = await this.collection
      .find({
        _id: { $in: participantObjIds },
      })
      .toArray();
    if (!participants) {
      throw new Error('No participants found');
    }

    return participants.map(toConversationParticipantObject);
  }

  public async readConversation(input: ReadConversationInput): Promise<boolean> {
    const { userId: id, conversationId: convoId } = input;

    const userId = new ObjectId(id);
    const conversationId = new ObjectId(convoId);

    const conversationParticipant = await this.collection.findOneAndUpdate(
      { userId, conversationId },
      { $set: { ...{ hasSeenLastestMessage: true } } },
      { returnDocument: 'after' }
    );
    if (!conversationParticipant) {
      throw new Error('Can not find a conversation participant');
    }

    return true;
  }
}

export { ConversationParticipantProvider };
