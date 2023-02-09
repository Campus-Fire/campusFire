import { gql } from 'apollo-server-express';

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
    mainImage: Image
    otherImages: [Image]
    isActive: Boolean!
  }

  type Query {
    availableProfiles: [Profile!]!
    getUserProfile(id: String!): Profile!
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
