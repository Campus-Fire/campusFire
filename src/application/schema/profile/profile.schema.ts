import { gql } from 'apollo-server';

const typeDefs = gql`
  type Profile {
    id: ObjectID!
    instituteId: ObjectID!
    firstName: String!
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    tagline: String!
    about: String!
    faculty: Faculty!
    interests: [Interest!]!
    onResidence: Boolean!
    isActive: Boolean!
  }

  type Query {
    profiles: [Profile!]!
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile!
  }

  input CreateProfileInput {
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: Gender!
    tagline: String!
    about: String!
    faculty: Faculty!
    interests: [Interest!]!
    onResidence: Boolean!
  }
`;

export { typeDefs };
