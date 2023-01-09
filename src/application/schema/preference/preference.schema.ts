import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Preference {
    id: ObjectID!
    gender: Gender!
  }
`;

export { typeDefs };
