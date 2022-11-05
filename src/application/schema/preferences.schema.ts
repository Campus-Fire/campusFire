import { gql } from 'apollo-server';

const typeDefs = gql`
  type Preferences {
    userId: ObjectID!
    gender: String!
    likes: [ObjectID]
  }

  type Query {
    preferences: [Preferences!]!
  }
`;
