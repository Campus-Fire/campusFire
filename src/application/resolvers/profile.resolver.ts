import { profileProvider } from '../providers';
import { Profile, UpdateProfileInput } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const profileResolver = {
  Query: {
    profiles: async (): Promise<Profile[]> => {
      return profileProvider.getProfiles();
    },
  },

  Mutation: {
    updateProfile: async (_: Root, args: { input: UpdateProfileInput }): Promise<Profile> => {
      return profileProvider.updateProfile(args.input);
    },
  },
};

export { profileResolver };
