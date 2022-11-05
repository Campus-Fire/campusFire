import { gql } from 'apollo-server-core';

import { typeDefs as profilesTypeDefs } from './profiles.schema';
import { typeDefs as preferencesTypeDefs } from './preferences.schema';

const scalarSchema = gql`
  scalar ObjectID
  scalar Long
`;

const typeDefs = gql`
  ${scalarSchema}
  ${profilesTypeDefs}
  ${preferencesTypeDefs}
`;

export { typeDefs };
