import { gql } from 'apollo-server-core';

import { typeDefs as accountTypeDefs } from './account/account.schema';
import { typeDefs as instituteTypeDefs } from './institute/institute.schema';
import { typeDefs as preferenceTypeDefs } from './preference/preference.schema';
import { typeDefs as profileTypeDefs } from './profile/profile.schema';
import { typeDefs as enums } from './enums/enums.schema';
import { typeDefs as imageTypeDefs } from './image/image.schema';

const scalarSchema = gql`
  scalar ObjectID
  scalar Long
`;

const typeDefs = gql`
  ${scalarSchema}
  ${enums}
  ${profileTypeDefs}
  ${preferenceTypeDefs}
  ${instituteTypeDefs}
  ${accountTypeDefs}
  ${imageTypeDefs}
`;

export { typeDefs };
