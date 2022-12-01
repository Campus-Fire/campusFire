import { gql } from 'apollo-server';

const typeDefs = gql`
  type Profile {
    id: ObjectID!
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: Gender!
    tagline: String!
    about: String!
    instituteId: ObjectID!
    faculty: String!
    location: String!
    isActive: Boolean!
  }

  type Query {
    profiles: [Profile!]!
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile!
    updateProfile(input: UpdateProfileInput!): Profile!
  }

  input CreateProfileInput {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: Gender!
    tagline: String!
    about: String!
    faculty: String!
    location: String!
    preferredGender: Gender!
  }

  input UpdateProfileInput {
    firstName: String
    lastName: String
    dateOfBirth: String
    gender: Gender
    tagline: String
    about: String
    faculty: String
    location: String
    isActive: Boolean
  }
`;

export { typeDefs };
