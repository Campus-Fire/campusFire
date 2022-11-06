import { gql } from 'apollo-server';

const typeDefs = gql`
  type Profile {
    id: ObjectID!
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
    updateProfile(input: UpdateProfileInput!): Profile!
  }

  input UpdateProfileInput {
    id: ObjectID!
    firstName: String
    lastName: String
    dateOfBirth: String
    gender: String
    isActive: Boolean
  }
`;

export { typeDefs };
