import { gql } from 'apollo-server';

const typeDefs = gql`
  type Account {
    id: ObjectID!
    email: String!
    password: String!
    isVerified: Boolean!
  }

  type Query {
    accounts: [Account!]!
  }
`;

export { typeDefs };
