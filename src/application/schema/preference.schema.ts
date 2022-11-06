import { gql } from 'apollo-server';

const typeDefs = gql`
  type Preference {
    userId: ObjectID!
    gender: String!
    likes: [ObjectID]
  }

  type Query {
    preference: [Preference!]!
  }
`;

export { typeDefs };
