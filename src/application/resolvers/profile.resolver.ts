import checkAuth from '../../helpers/check-auth';
import { profileProvider } from '../indexes/providers.index';
import { MutationCreateProfileArgs, Profile, QueryGetUserProfileArgs } from '../schema/types/schema';
import { Root, UserContext } from '../schema/types/types';

interface UnresolvedProfile extends Omit<Profile, 'mainImage'|'otherImages'>{}

const profileResolver = {
  Query: {
    availableProfiles: async (_: Root, _args: any, context: UserContext): Promise<UnresolvedProfile[]> => {
      const session = checkAuth(context);
      const { id: userId } = session.user;

      return profileProvider.getAllProfiles(userId);
    },

    getUserProfile: async (_: Root, args: QueryGetUserProfileArgs, context: UserContext): Promise<UnresolvedProfile> => {
      checkAuth(context);

      return profileProvider.getProfile(args.id);
    },
  },

  Mutation: {
    createProfile: async (_: Root, args: MutationCreateProfileArgs, context: UserContext): Promise<UnresolvedProfile> => {
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
