import { gql } from 'apollo-server';

const typeDefs = gql`
  type Preference {
    userId: ObjectID!
    gender: String!
    usersEncountered: [ObjectID]
    liked: [ObjectID]
    likedBy: [ObjectID]
    disliked: [ObjectID]
  }

  type Query {
    preference: [Preference!]!
  }

  type Mutation {
    likeUserProfile(input: ProfileInteractionInput!): Preference!
    dislikeUserProfile(input: ProfileInteractionInput!): Preference!
  }

  input ProfileInteractionInput {
    profileId: ObjectID!
  }
`;

export { typeDefs };
