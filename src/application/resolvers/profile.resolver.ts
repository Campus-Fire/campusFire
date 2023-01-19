import checkAuth from '../../helpers/check-auth';
import { profileProvider } from '../indexes/providers.index';
import { MutationCreateProfileArgs, Profile, QueryGetProfileArgs } from '../schema/types/schema';
import { Root, UserContext } from '../schema/types/types';

const profileResolver = {
  Query: {
    allProfiles: async (_: Root, _args: any, context: UserContext): Promise<Profile[]> => {
      const session = checkAuth(context);
      const { id: userId } = session.user;

      return profileProvider.getAllProfiles(userId);
    },

    getProfile: async (_: Root, args: QueryGetProfileArgs, context: UserContext): Promise<Profile> => {
      checkAuth(context);

      return profileProvider.getProfile(args.id);
    },
  },

  Mutation: {
    createProfile: async (_: Root, args: MutationCreateProfileArgs, context: UserContext): Promise<Profile> => {
      const session = checkAuth(context);
      const input = {
        ...session.user,
        ...args.input,
      };

      return profileProvider.createProfile(input);
    },
  },
};

export { profileResolver };
