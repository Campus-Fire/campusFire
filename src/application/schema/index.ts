import { gql } from 'apollo-server-core';

import { typeDefs as accountTypeDefs } from './typeDefs/account.schema';
import { typeDefs as instituteTypeDefs } from './typeDefs/institute.schema';
import { typeDefs as preferenceTypeDefs } from './typeDefs/preference.schema';
import { typeDefs as profileTypeDefs } from './typeDefs/profile.schema';

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
