import { merge } from 'lodash';

import { imageResolver } from '../../resolvers/image.resolver';
import { accountResolver } from '../../resolvers/account.resolver';
import { instituteResolver } from '../../resolvers/institute.resolver';
import { preferenceResolver } from '../../resolvers/preference.resolver';
import { profileResolver } from '../../resolvers/profile.resolver';
import { conversationResolver } from '../../resolvers/conversation.resolver';
import { messageResolver } from '../../resolvers/message.resolver';

const resolvers = merge(
  profileResolver,
  preferenceResolver,
  instituteResolver,
  accountResolver,
  imageResolver,
  conversationResolver,
  messageResolver
);

export { resolvers };
