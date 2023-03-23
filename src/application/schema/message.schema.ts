import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Message {
    id: ObjectID!
    senderId: ObjectID!
    body: String!
    conversationId: ObjectID!
    createdAt: Date!
    hasReaction: Boolean!
    reaction: MessageReaction
  }

  type Query {
    conversationMessages(conversationId: ObjectID!): [Message!]
  }

  type Mutation {
    sendMessage(input: SendMessageInput!): Boolean!
    addReaction(input: AddReactionInput!): Boolean!
  }

  type Subscription {
    messageSent(conversationId: String!): Message
  }

  input SendMessageInput {
    conversationId: ObjectID!
    body: String!
  }

  input AddReactionInput {
    messageId: ObjectID!
    reaction: MessageReaction!
  }
`;

export { typeDefs };
