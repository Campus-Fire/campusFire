import { gql } from 'apollo-server';

const typeDefs = gql`
  type Account {
    id: ObjectID!
    email: String!
    password: String!
    isVerified: Boolean!
  }

  type Query {
    accounts: [Account!]!
  }

  type Mutation {
    createAccount(input: CreateAccountInput!): Account!
  }

  input CreateAccountInput {
    email: String!
    password: String!
  }
`;

export { typeDefs };
