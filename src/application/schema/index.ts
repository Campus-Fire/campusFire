import { gql } from 'apollo-server-core';

import { typeDefs as accountTypeDefs } from './account.schema';
import { typeDefs as instituteTypeDefs } from './institute.schema';
import { typeDefs as profileTypeDefs } from './profile.schema';
import { typeDefs as enums } from './enums.schema';
import { typeDefs as imageTypeDefs } from './image.schema';
import { typeDefs as conversationTypeDefs } from './conversation.schema';
import { typeDefs as messageTypeDefs } from './message.schema';

const scalarSchema = gql`
  scalar ObjectID
  scalar Date
`;

const typeDefs = gql`
  ${scalarSchema}
  ${enums}
  ${profileTypeDefs}
  ${instituteTypeDefs}
  ${accountTypeDefs}
  ${imageTypeDefs}
  ${conversationTypeDefs}
  ${messageTypeDefs}
`;

export { typeDefs };
