import { gql } from 'apollo-server-core';

import { typeDefs as profileTypeDefs } from './profile.schema';
import { typeDefs as preferenceTypeDefs } from './preference.schema';
import { typeDefs as instituteTypesDefs } from './institute.schema';

const scalarSchema = gql`
  scalar ObjectID
  scalar Long
`;

const typeDefs = gql`
  ${scalarSchema}
  ${profileTypeDefs}
  ${preferenceTypeDefs}
  ${instituteTypesDefs}
`;

export { typeDefs };
