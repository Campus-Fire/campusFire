import { ExpressContext } from 'apollo-server-express';

import checkAuth from '../../helpers/check-auth';
import { profileProvider } from '../indexes/provider';
import { MutationCreateProfileArgs, MutationUpdateProfileArgs, Profile } from '../schema/types/schema';
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

    async updateProfile(_: Root, args: MutationUpdateProfileArgs, context: ExpressContext): Promise<Profile> {
      const { id } = checkAuth(context);
      const input = { id, ...args.input };

      return profileProvider.updateProfile(input);
    },
  },
};

export { profileResolver };
