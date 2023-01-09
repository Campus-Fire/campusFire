import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type ConversationParticipant {
    id: ObjectID!
    userId: ObjectID!
    createdAt: Date!
  }

  type Conversation {
    id: ObjectID!
    participantIds: [ObjectID!]!
    latestMessageId: ObjectID
    updatedAt: Date!
  }

  type Query {
    conversations: [Conversation]
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
