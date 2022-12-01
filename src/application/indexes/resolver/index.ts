import { merge } from 'lodash';

import { accountResolver } from '../../resolvers/account.resolver';
import { instituteResolver } from '../../resolvers/institute.resolver';
import { preferenceResolver } from '../../resolvers/preference.resolver';
import { profileResolver } from '../../resolvers/profile.resolver';

const resolvers = merge(profileResolver, preferenceResolver, instituteResolver, accountResolver);

export { resolvers };
