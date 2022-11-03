import { gql } from 'apollo-server-core';

const scalarSchema = gql`
  scalar ObjectID
  scalar Long
`;

const typeDefs = gql`
  ${scalarSchema}
`;

export { typeDefs };
