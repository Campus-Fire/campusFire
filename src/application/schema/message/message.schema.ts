import { gql } from 'apollo-server';

const typeDefs = gql`
  type Message {
    id: ObjectID!
    senderId: ObjectID!
    body: String!
    conversationId: ObjectID!
    createdAt: Date!
  }

  type Query {
    messages: [Message]
  }

  type Mutation {
    sendMessage(input: SendMessageInput!): Boolean!
  }

  type Subscription {
    messageSent(conversationId: String!): Message
  }

  input SendMessageInput {
    conversationId: ObjectID!
    body: String!
  }
`;

export { typeDefs };
