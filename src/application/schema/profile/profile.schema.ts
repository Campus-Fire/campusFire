import { gql } from 'apollo-server';

const typeDefs = gql`
  type Profile {
    id: ObjectID!
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: String!
    instituteId: ObjectID!
    isActive: Boolean!
  }

  type Query {
    getProfile: Profile!
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile!
    updateProfile(input: UpdateProfileInput!): Profile!
  }

  input CreateProfileInput {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: String!
    preferredGender: String!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    dateOfBirth: String
    gender: String
    isActive: Boolean
  }
`;

export { typeDefs };
