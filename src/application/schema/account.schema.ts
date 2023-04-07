import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Account {
    id: ObjectID!
    email: String!
    isVerified: Boolean!
    createdAt: Date!
    expiresAt: Date!
    lastLogin: Date
    token: String
  }

  type Query {
    accounts: [Account!]!
    termsOfUse: String!
    privacyPolicy: String!
    refreshToken(token: String!): Account!
  }

  type Mutation {
    registerAccount(input: RegisterAccountInput!): Account!
    login(input: LoginInput!): Account!
    verifyAccountRegistration(input: VerificationCodeInput!): Boolean!
    resendVerificationCode: Boolean!
    forgotPasswordRequest(input: ResetPasswordRequestInput!): String!
    verifyAccountPasswordReset(input: ForgotPasswordVerificationCodeInput!): Boolean!
    resetPassword(input: ResetPasswordInput!): Account!
    deleteAccount: Boolean!
  }

  input ResetPasswordInput {
    token: String!
    password: String!
    confirmPassword: String!
  }

  input ResetPasswordRequestInput {
    email: String!
  }

  input ForgotPasswordVerificationCodeInput {
    code: String!
    token: String!
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
