import { gql } from 'apollo-server';

const typeDefs = gql`
  enum Gender {
    MALE
    FEMALE
    OTHER
  }
`;

export { typeDefs };
