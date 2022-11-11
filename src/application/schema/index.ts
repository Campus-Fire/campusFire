import { gql } from 'apollo-server-core';

import { typeDefs as accountTypeDefs } from './account.schema';
import { typeDefs as instituteTypeDefs } from './institute.schema';
import { typeDefs as preferenceTypeDefs } from './preference.schema';
import { typeDefs as profileTypeDefs } from './profile.schema';

const scalarSchema = gql`
  scalar ObjectID
  scalar Long
`;

const typeDefs = gql`
  ${scalarSchema}
  ${profileTypeDefs}
  ${preferenceTypeDefs}
  ${instituteTypeDefs}
  ${accountTypeDefs}
`;

export { typeDefs };
