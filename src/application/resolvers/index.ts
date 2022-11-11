import { merge } from 'lodash';

import { accountResolver } from './account.resolver';
import { instituteResolver } from './institute.resolver';
import { preferenceResolver } from './preference.resolver';
import { profileResolver } from './profile.resolver';

const resolvers = merge(profileResolver, preferenceResolver, instituteResolver, accountResolver);

export { resolvers };
