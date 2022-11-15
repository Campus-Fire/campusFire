import { gql } from 'apollo-server';

const typeDefs = gql`
  type Message {
    from: ObjectID!
    to: ObjectID!
    text: String!
    at: String!
  }

  type Mutation {
    receiveMessage(input: ReceiveMessageInput!): [Message]
    sendMessage(input: SendMessageInput!): Boolean!
  }

  input SendMessageInput {
    from: ObjectID!
    to: ObjectID!
    text: String!
  }

  input ReceiveMessageInput {
    user: ObjectID!
    oppUser: ObjectID!
  }
`;

export { typeDefs };
