import { gql } from 'apollo-server-core';
import { typeDefs as accountTypeDefs } from './account/account.schema';
import { typeDefs as instituteTypeDefs } from './institute/institute.schema';
import { typeDefs as messageTypeDefs } from './message/message.schema';
import { typeDefs as preferenceTypeDefs } from './preference/preference.schema';
import { typeDefs as profileTypeDefs } from './profile/profile.schema';

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
  ${messageTypeDefs}
`;

export { typeDefs };
