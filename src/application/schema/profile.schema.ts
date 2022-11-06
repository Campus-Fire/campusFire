import { gql } from 'apollo-server';

const typeDefs = gql`
  type Profile {
    id: ObjectID!
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: String!
    isActive: Boolean!
  }

  type Query {
    profiles: [Profile!]!
  }

  type Mutation {
    createProfile(input: CreateProfileInput!): Profile!
  }

  input CreateProfileInput {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    dateOfBirth: String!
    gender: String!
    preferredGender: String!
  }
`;

export { typeDefs };
