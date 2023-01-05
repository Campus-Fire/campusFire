import checkAuth from '../../helpers/check-auth';
import { profileProvider } from '../indexes/provider';
import { MutationCreateProfileArgs, Profile, QueryGetProfileArgs } from '../schema/types/schema';
import { Root, UserContext } from '../schema/types/types';

const profileResolver = {
  Query: {
    allProfiles: async (_: Root, _args: any, context: UserContext): Promise<Profile[]> => {
      const { user } = checkAuth(context);
      const userId = user.id;

      return profileProvider.getAllProfiles(userId);
    },

    getProfile: async (_: Root, args: QueryGetProfileArgs, context: UserContext): Promise<Profile> => {
      checkAuth(context);

      return profileProvider.getProfile(args.id);
    },
  },

  Mutation: {
    createProfile: async (_: Root, args: MutationCreateProfileArgs, context: UserContext): Promise<Profile> => {
      const { user } = checkAuth(context);
      const input = { ...user, ...args.input };

      return profileProvider.createProfile(input);
    },
  },
};

export { profileResolver };
