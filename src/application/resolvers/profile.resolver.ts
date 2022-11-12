import { ExpressContext } from 'apollo-server-express';

import checkAuth from '../helpers/check-auth.helper';
import { profileProvider } from '../providers';
import { MutationCreateProfileArgs, MutationUpdateProfileArgs, Profile } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const profileResolver = {
  Query: {
    async profiles(): Promise<Profile[]> {
      return profileProvider.getProfiles();
    },
  },

  Mutation: {
    async createProfile(_: Root, args: MutationCreateProfileArgs, context: ExpressContext): Promise<Profile> {
      const { id, email } = checkAuth(context);
      const input = { id, email, ...args.input };

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
