import { profileProvider } from '../providers';
import { CreateProfileInput, Profile } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const profileResolver = {
  Query: {
    profiles: async (): Promise<Profile[]> => {
      return profileProvider.getProfiles();
    },
  },

  Mutation: {
    createProfile: async (_: Root, args: { input: CreateProfileInput }): Promise<Profile> => {
      return profileProvider.createProfile(args.input);
    },
  },
};

export { profileResolver };
