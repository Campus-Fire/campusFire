import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Institute {
    id: ObjectID!
    name: String!
    emailExt: String!
    city: String!
    province: String!
    country: String!
  }

  type Query {
    institutes: [Institute!]!
  }
`;

export { typeDefs };
