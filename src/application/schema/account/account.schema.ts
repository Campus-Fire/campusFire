import { gql } from 'apollo-server';

const typeDefs = gql`
  type Account {
    id: ObjectID!
    email: String!
    isVerified: Boolean!
    createdAt: String!
    lastLogin: String
    token: String!
  }

  type Query {
    accounts: [Account!]!
  }

  type Mutation {
    registerAccount(input: RegisterAccountInput!): Account!
    login(input: LoginInput!): Account!
    verifyAccount(input: VerificationCodeInput!): Boolean!
  }

  input VerificationCodeInput {
    code: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input RegisterAccountInput {
    email: String!
    password: String!
    confirmPassword: String!
  }
`;

export { typeDefs };
