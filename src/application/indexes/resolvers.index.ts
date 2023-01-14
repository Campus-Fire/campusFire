import { merge } from 'lodash';
import { accountResolver } from '../resolvers/account.resolver';
import { conversationResolver } from '../resolvers/conversation.resolver';
import { imageResolver } from '../resolvers/image.resolver';
import { instituteResolver } from '../resolvers/institute.resolver';
import { messageResolver } from '../resolvers/message.resolver';
import { profileResolver } from '../resolvers/profile.resolver';
import { conversationParticipantResolver } from '../resolvers/conversation-participant.resolver';

const resolvers = merge(
  profileResolver,
  instituteResolver,
  accountResolver,
  imageResolver,
  conversationResolver,
  messageResolver,
  conversationParticipantResolver
);

export { resolvers };
