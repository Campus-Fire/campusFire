import { gql } from 'apollo-server';

const typeDefs = gql`
  type Preference {
    id: ObjectID!
    gender: Gender!
  }

  type Query {
    preference: [Preference!]!
  }
`;

export { typeDefs };
