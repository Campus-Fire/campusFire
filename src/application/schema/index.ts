import { gql } from 'apollo-server-core';

import { typeDefs as accountTypeDefs } from './account/account.schema';
import { typeDefs as instituteTypeDefs } from './institute/institute.schema';
import { typeDefs as preferenceTypeDefs } from './preference/preference.schema';
import { typeDefs as profileTypeDefs } from './profile/profile.schema';
import { typeDefs as enums } from './enums/enums.schema';
import { typeDefs as imageTypeDefs } from './image/image.schema';
import { typeDefs as conversationTypeDefs } from './conversation/conversation.schema';
import { typeDefs as messageTypeDefs } from './message/message.schema';

const scalarSchema = gql`
  scalar ObjectID
  scalar Date
`;

const typeDefs = gql`
  ${scalarSchema}
  ${enums}
  ${profileTypeDefs}
  ${preferenceTypeDefs}
  ${instituteTypeDefs}
  ${accountTypeDefs}
  ${imageTypeDefs}
  ${conversationTypeDefs}
  ${messageTypeDefs}
`;

export { typeDefs };
