import { merge } from 'lodash';

import { preferenceResolver } from './preference.resolver';
import { profileResolver } from './profile.resolver';
import { instituteResolver } from './institute.resolver';
import { accountResolver } from './account.resolver';

const resolvers = merge(profileResolver, preferenceResolver, instituteResolver, accountResolver);

export { resolvers };
