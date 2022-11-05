import { merge } from 'lodash';

import { profileResolver } from './profile.resolver';

const resolvers = merge(profileResolver);

export { resolvers };
