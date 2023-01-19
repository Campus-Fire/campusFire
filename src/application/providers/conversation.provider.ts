import { Collection, ObjectId } from 'mongodb';
import { ConversationDocument, toConversationObject } from '../repositories/conversation.repository';
import { conversationParticipantProvider, messageProvider } from '../indexes/providers.index';
import { Message } from '../models/message.model';
import { Conversation, StartConversationInput } from '../models/conversation.model';
import { CFError } from '../../lib/errors-handler';

class ConversationProvider {
  constructor(private collection: Collection<ConversationDocument>) {}

  public async getUserConversations(id: ObjectId): Promise<Conversation[]> {
    const userId = new ObjectId(id);
    const userConversationsIds = await conversationParticipantProvider.getConversationsIds(userId);

    const conversations = await this.collection.find({ _id: { $in: userConversationsIds } }).toArray();
    if (!conversations) {
      throw new CFError('CONVERSATION_NOT_FOUND');
    }

    return conversations.map(toConversationObject);
  }

  public async startConversation(input: StartConversationInput): Promise<string> {
    const { userId, participantIds } = input;
    let participants: ObjectId[] = [];

    const conversationId = new ObjectId();
    const senderId = new ObjectId(userId);

    for (let participantId of participantIds) {
      participants.push(
        await conversationParticipantProvider.createParticipant(conversationId, new ObjectId(participantId))
      );
    }

    const conversationData = await this.collection.insertOne({
      _id: conversationId,
      participantIds: participants,
      updatedAt: new Date(),
    });
    if (!conversationData.insertedId) {
      throw new CFError('CONVERSATION_NOT_STARTED');
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

  public async updateLatestMessage(message: Message): Promise<Conversation> {
    const { id: messageId, senderId, conversationId } = message;

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
      throw new CFError('CONVERSATION_NOTIFICATION_FAILED');
    }

    for (let participant of convData.value.participantIds) {
      await conversationParticipantProvider.setLatestMessageSeenStatus(convData.value._id, senderId, participant);
    }

    return toConversationObject(convData.value);
  }

  public async isConversationUpdated(id: ObjectId, conversation: ObjectId): Promise<boolean> {
    const userId = new ObjectId(id);
    const conversationId = new ObjectId(conversation);

    const conversationData = await this.collection.findOne({
      _id: conversationId,
    });
    if (!conversationData) {
      throw new CFError('CONVERSATION_NOT_FOUND');
    }
    if (!conversationData.latestMessageId) {
      return false;
    }

    const isUserConversationParticipant = await conversationParticipantProvider.isParticipant(
      userId,
      conversationData._id
    );
    const userSentLatestMessage = await messageProvider.isSender(userId, conversationData.latestMessageId);

    return isUserConversationParticipant && !userSentLatestMessage;
  }
}

export { ConversationProvider };