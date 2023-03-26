import { Collection, ObjectId } from 'mongodb';
import { CFError } from '../../lib/errors-handler';
import { profileProvider } from '../indexes/providers.index';
import { ConversationParticipant, ReadConversationInput } from '../models/conversation.model';
import {
  ConversationParticipantDocument,
  toConversationParticipantObject,
} from '../repositories/conversation-participant.repository';

class ConversationParticipantProvider {
  constructor(private collection: Collection<ConversationParticipantDocument>) {}

  public async createParticipant(convoId: ObjectId, usrId: ObjectId): Promise<ObjectId> {
    const userId = new ObjectId(usrId);
    const conversationId = new ObjectId(convoId);

    await profileProvider.isUserActive(userId);

    const participantData = await this.collection.insertOne({
      _id: new ObjectId(),
      userId,
      conversationId,
      hasSeenLatestMessage: false,
      createdAt: new Date(),
    });
    if (!participantData.insertedId) {
      throw new CFError('CONVERSATION_NOT_STARTED');
    }

    return participantData.insertedId;
  }

  public async setLatestMessageSeenStatus(
    convoId: ObjectId,
    senderId: ObjectId,
    participantId: ObjectId
  ): Promise<void> {
    const userId = await this.getUserIdByParticipant(participantId);
    const conversationId = new ObjectId(convoId);
    const hasSeenLastMessage = senderId.toHexString() === userId.toHexString();

    const participantData = await this.collection.findOneAndUpdate(
      { userId, conversationId },
      { $set: { ...{ hasSeenLatestMessage: hasSeenLastMessage } } },
      { returnDocument: 'after' }
    );
    if (!participantData) {
      throw new CFError('MESSAGE_NOT_SENT');
    }
  }

  public async getUserIdByParticipant(participantId: ObjectId): Promise<ObjectId> {
    const id = new ObjectId(participantId);

    const data = await this.collection.findOne({ _id: id });
    if (!data) {
      throw new CFError('CONVERSATION_PARTICIPANT_NOT_FOUND');
    }

    return data.userId;
  }

  public async getParticipantById(participantId: ObjectId): Promise<ConversationParticipant> {
    const id = new ObjectId(participantId);

    const participantData = await this.collection.findOne({ _id: id });
    if (!participantData) {
      throw new CFError('CONVERSATION_PARTICIPANT_NOT_FOUND');
    }

    return toConversationParticipantObject(participantData);
  }

  public async getParticipantByUserId(usrId: ObjectId, convoId: ObjectId): Promise<ObjectId> {
    const userId = new ObjectId(usrId);
    const conversationId = new ObjectId(convoId);

    const participantData = await this.collection.findOne({ userId, conversationId });
    if (!participantData) {
      throw new CFError('CONVERSATION_PARTICIPANT_NOT_FOUND');
    }

    return participantData._id;
  }

  public async readConversation(input: ReadConversationInput): Promise<boolean> {
    const { userId: id, conversationId: convoId } = input;

    const userId = new ObjectId(id);
    const conversationId = new ObjectId(convoId);

    const conversationParticipant = await this.collection.findOneAndUpdate(
      { userId, conversationId },
      { $set: { ...{ hasSeenLatestMessage: true } } },
      { returnDocument: 'after' }
    );
    if (!conversationParticipant) {
      throw new CFError('CONVERSATION_PARTICIPANT_NOT_FOUND');
    }

    return true;
  }

  public async getConversationIds(usrId: ObjectId): Promise<ObjectId[]> {
    const userId = new ObjectId(usrId);

    const conversationParticipantData = await this.collection.find({ userId: userId }).toArray();
    if (!conversationParticipantData) {
      throw new CFError('CONVERSATION_NOT_FOUND');
    }

    const conversationIds = conversationParticipantData.map((conversationParticipant) => {
      return conversationParticipant.conversationId;
    });

    return conversationIds;
  }

  public async isParticipant(usrId: ObjectId, convoId: ObjectId): Promise<boolean> {
    const userId = new ObjectId(usrId);
    const conversationId = new ObjectId(convoId);

    const participantData = await this.collection.findOne({ userId, conversationId });
    if (!participantData) {
      return false;
    }

    return true;
  }
}

export { ConversationParticipantProvider };
