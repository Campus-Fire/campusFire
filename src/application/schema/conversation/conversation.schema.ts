import { gql } from 'apollo-server';

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
  }

  input StartConversationInput {
    participantIds: [ObjectID!]!
  }
`;

export { typeDefs };
