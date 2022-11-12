import { gql } from 'apollo-server';

const typeDefs = gql`
  type Institute {
    id: ObjectID!
    name: String!
    emailExt: String!
    city: String!
    province: String!
    country: String!
    userIds: [ObjectID]
  }

  type Query {
    institutes: [Institute!]!
  }
`;

export { typeDefs };
