import { gql } from 'apollo-server';

const typeDefs = gql`
  type Account {
    id: ObjectID!
    email: String!
    password: String!
    isVerified: Boolean!
    createdAt: String!
    token: String!
  }

  type Query {
    accounts: [Account!]!
  }

  type Mutation {
    registerAccount(input: RegisterAccountInput!): Account!
  }

  input RegisterAccountInput {
    email: String!
    password: String!
    confirmPassword: String!
  }
`;

export { typeDefs };
