import { gql } from 'apollo-server';

const typeDefs = gql`
  type Account {
    id: ObjectID!
    email: String!
    isVerified: Boolean!
    createdAt: DateTime!
    lastLogin: DateTime
    token: String
  }

  type Query {
    accounts: [Account!]!
    termsOfUse: String!
    privacyPolicy: String!
  }

  type Mutation {
    registerAccount(input: RegisterAccountInput!): Account!
    login(input: LoginInput!): Account!
    verifyAccountRegistration(input: VerificationCodeInput!): Boolean!
    resendVerificationCode: Boolean!
    forgotPasswordRequest(input: ResetPasswordRequestInput!): String!
    verifyAccountPasswordReset(input: VerificationCodeInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Account!
  }

  input ResetPasswordInput {
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
