import { Collection, ObjectId } from 'mongodb';
import { CFError } from '../../lib/errors-handler';
import { conversationParticipantProvider, messageProvider } from '../indexes/providers.index';
import {
  AcceptConversationRequestInput,
  Conversation,
  SendConversationRequestInput,
} from '../models/conversation.model';
import { Message } from '../models/message.model';
import { ConversationDocument, toConversationObject } from '../repositories/conversation.repository';

class ConversationProvider {
  constructor(private collection: Collection<ConversationDocument>) {}

  public async getUserConversations(id: ObjectId): Promise<Conversation[]> {
    const userId = new ObjectId(id);
    const conversationIds = await conversationParticipantProvider.getConversationIds(userId);

    const conversations = await this.collection
      .find({ _id: { $in: conversationIds }, isConversationRequest: false })
      .sort({ updatedAt: -1 })
      .toArray();
    if (!conversations) {
      throw new CFError('CONVERSATION_NOT_FOUND');
    }

    return conversations.map(toConversationObject);
  }

  public async getUserConversationRequests(id: ObjectId): Promise<Conversation[]> {
    const userId = new ObjectId(id);
    const conversationIds = await conversationParticipantProvider.getConversationIds(userId);

    const conversations = await this.collection
      .find({ _id: { $in: conversationIds }, isConversationRequest: true })
      .sort({ updatedAt: -1 })
      .toArray();
    if (!conversations) {
      throw new CFError('CONVERSATION_NOT_FOUND');
    }

    return conversations.map(toConversationObject);
  }

  public async sendConversationRequest(input: SendConversationRequestInput): Promise<string> {
    const { userId, participantId, requestMessage } = input;

    const conversationId = new ObjectId();

    const foundExisitingConversation = await this.hasExisitingConversation(userId, participantId);
    if (foundExisitingConversation !== null) {
      return foundExisitingConversation;
    }

    const startedBy = await conversationParticipantProvider.createParticipant(conversationId, userId);
    const participant = await conversationParticipantProvider.createParticipant(conversationId, participantId);

    const latestMessage = await messageProvider.sendMessage({
      userId,
      conversationId,
      body: requestMessage,
    });

    const conversationRequestData = await this.collection.insertOne({
      _id: conversationId,
      startedBy,
      participant,
      latestMessageId: latestMessage.id,
      isConversationRequest: true,
      updatedAt: new Date(),
    });
    if (!conversationRequestData.acknowledged) {
      throw new CFError('CONVERSATION_NOT_STARTED');
    }

    return conversationRequestData.insertedId.toHexString();
  }

  public async hasExisitingConversation(userId: ObjectId, participantId: ObjectId): Promise<string | null> {
    const userConversations = (await conversationParticipantProvider.getConversationIds(userId)).map((uConvo) =>
      uConvo.toHexString()
    );
    const participantConversations = (await conversationParticipantProvider.getConversationIds(participantId)).map(
      (pConvo) => pConvo.toHexString()
    );

    const userConversationsSet = new Set(userConversations);

    for (const conversation of participantConversations) {
      if (userConversationsSet.has(conversation)) {
        return conversation;
      }
    }

    return null;
  }

  public async acceptConversationRequest(input: AcceptConversationRequestInput): Promise<boolean> {
    const { userId, conversationId } = input;

    const usrId = new ObjectId(userId);
    const convoId = new ObjectId(conversationId);

    const participant = await conversationParticipantProvider.getParticipantByUserId(usrId, convoId);

    const conversationData = await this.collection.findOneAndUpdate(
      { _id: convoId, participant },
      { $set: { ...{ isConversationRequest: false } } },
      { returnDocument: 'after' }
    );
    if (!conversationData.value) {
      throw new CFError('CONVERSATION_NOT_FOUND');
    }

    return conversationData.value.isConversationRequest;
  }

  public async updateLatestMessage(message: Message): Promise<Conversation> {
    const { id: messageId, conversationId } = message;

    const convoId = new ObjectId(conversationId);
    const latestMessageId = new ObjectId(messageId);

    const convData = await this.collection.findOneAndUpdate(
      { _id: convoId },
      { $set: { ...{ latestMessageId: latestMessageId }, ...{ updatedAt: new Date() } } },
      { returnDocument: 'after' }
    );
    if (!convData.value) {
      throw new CFError('CONVERSATION_NOTIFICATION_FAILED');
    }

    await conversationParticipantProvider.setLatestMessageSeenStatus(
      convData.value._id,
      message.senderId,
      convData.value.startedBy
    );
    await conversationParticipantProvider.setLatestMessageSeenStatus(
      convData.value._id,
      message.senderId,
      convData.value.participant
    );

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

    return isUserConversationParticipant;
  }
}

export { ConversationProvider };
