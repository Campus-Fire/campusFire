import { Collection, ObjectId } from 'mongodb';
import { ConversationDocument, toConversationObject } from '../../../entities/conversation.entity';
import { conversationParticipantProvider, messageProvider } from '../../indexes/provider';
import { Message } from '../message/message.provider.type';
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
      throw new Error('Could not notify other users');
    }

    for (let participant of convData.value.participantIds) {
      await conversationParticipantProvider.setLatestMessageSeenStatus(convData.value._id, senderId, participant);
    }

    return toConversationObject(convData.value);
  }

  public async isConversationUpdated(id: ObjectId, conversation: ObjectId): Promise<boolean> {
    const userId = new ObjectId(id);
    const conversationId = new ObjectId(conversation);

    const conversationData = await this.collection.findOne({ _id: conversationId });
    if (!conversationData) {
      throw new Error('Could not find the conversation');
    }

    if (!conversationData.latestMessageId) {
      return false;
    }

    const isUserConversationParticipant = await conversationParticipantProvider.isParticipant(
      userId,
      conversationData._id
    );

    const userSentLatestMessage = await messageProvider.isSender(userId, conversationData.latestMessageId);

    return isUserConversationParticipant;
  }
}

export { ConversationProvider };
