import { gql } from 'apollo-server';

const typeDefs = gql`
  type Preference {
    id: ObjectID!
    gender: String!
    usersEncountered: [ObjectID]
    liked: [ObjectID]
    likedBy: [ObjectID]
    disliked: [ObjectID]
  }

  type Query {
    preference: [Preference!]!
  }
`;

export { typeDefs };
