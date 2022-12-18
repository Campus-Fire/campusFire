import { gql } from 'apollo-server';

const typeDefs = gql`
  type Account {
    id: ObjectID!
    email: String!
    isVerified: Boolean!
    createdAt: String!
    lastLogin: String
    token: String
  }

  type Query {
    accounts: [Account!]!
  }

  type Mutation {
    registerAccount(input: RegisterAccountInput!): Account!
    login(input: LoginInput!): Account!
    verifyAccountRegistration(input: VerificationCodeInput!): Boolean!
    resendVerificationCode: Boolean!
    forgotPasswordRequest(input: ResetPasswordRequestInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Account!
  }

  input ResetPasswordInput {
    code: String!
    password: String!
    confirmPassword: String!
  }

  input ResetPasswordRequestInput {
    email: String!
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
  }
`;

export { typeDefs };
