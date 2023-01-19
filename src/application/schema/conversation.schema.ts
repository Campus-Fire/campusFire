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
    participants: [ConversationParticipant!]!
    latestMessage: Message
    updatedAt: Date!
  }

  type Query {
    userConversations: [Conversation!]
  }

  type Mutation {
    startConversation(input: StartConversationInput!): String!
    readConversation(input: ReadConversationInput!): Boolean!
  }

  input StartConversationInput {
    participantIds: [ObjectID!]!
  }

  input ReadConversationInput {
    conversationId: ObjectID!
  }

  type Subscription {
    conversationUpdated: Conversation
  }
`;

export { typeDefs };
