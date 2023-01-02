import { gql } from 'apollo-server';

const typeDefs = gql`
  type Profile {
    id: ObjectID!
    firstName: String!
    lastName: String!
    dateOfBirth: Date!
    gender: Gender!
    tagline: String!
    about: String!
    interests: [Interest!]!
    instituteId: ObjectID!
    faculty: Faculty!
    onResidence: Boolean!
    mainImage: ObjectID
    images: [ObjectID!]
    isActive: Boolean!
  }

  type Query {
    allProfiles: [Profile!]!
    getProfile(id: String!): Profile!
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
