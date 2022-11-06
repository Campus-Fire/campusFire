import { merge } from 'lodash';

import { preferenceResolver } from './preference.resolver';
import { profileResolver } from './profile.resolver';

const resolvers = merge(profileResolver, preferenceResolver);

export { resolvers };
