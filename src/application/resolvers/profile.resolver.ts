import { ExpressContext } from 'apollo-server-express';

import checkAuth from '../../helpers/check-auth';
import { profileProvider } from '../indexes/provider';
import { MutationCreateProfileArgs, Profile } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const profileResolver = {
  Query: {
    async profiles(_: Root, args: any, context: ExpressContext): Promise<Profile[]> {
      const { id } = checkAuth(context);

      return profileProvider.getAllProfiles(id);
    },
  },

  Mutation: {
    async createProfile(_: Root, args: MutationCreateProfileArgs, context: ExpressContext): Promise<Profile> {
      const tokenAuth = checkAuth(context);
      const input = { ...tokenAuth, ...args.input };

      return profileProvider.createProfile(input);
    },
  },
};

export { profileResolver };
