import { gql } from 'apollo-server-core';

import { typeDefs as userDetailsTypeDefs } from './userDetails.schema';

const scalarSchema = gql`
  scalar ObjectID
  scalar Long
`;

const typeDefs = gql`
  ${scalarSchema}
  ${userDetailsTypeDefs}
`;

export { typeDefs };
