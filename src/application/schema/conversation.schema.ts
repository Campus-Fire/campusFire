import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type ConversationParticipant {
    id: ObjectID!
    userId: ObjectID!
    hasSeenLatestMessage: Boolean!
    createdAt: Date!
  }

  type Conversation {
    id: ObjectID!
    startingParticipant: ConversationParticipant!
    acceptingParticipant: ConversationParticipant!
    latestMessage: Message!
    isConversationRequest: Boolean!
    updatedAt: Date!
  }

  type Query {
    getConversationRequests: [Conversation!]
    userConversations: [Conversation!]
    hasExistingConversation(participantId: String!): String
  }

  type Mutation {
    sendConversationRequest(input: SendConversationRequestInput!): String!
    acceptConversationRequest(input: AcceptConversationRequestInput!): Boolean!
    readConversation(input: ReadConversationInput!): Boolean!
  }

  input AcceptConversationRequestInput {
    conversationId: ObjectID!
  }

  input ReadConversationInput {
    conversationId: ObjectID!
  }

  input SendConversationRequestInput {
    participantId: ObjectID!
    requestMessage: String!
  }

  type Subscription {
    conversationUpdated: Conversation
  }
`;

export { typeDefs };
