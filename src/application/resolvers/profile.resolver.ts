import { profileProvider } from '../providers';
import { Profile } from '../schema/types/schema';

const profileResolver = {
  Query: {
    profiles: async (): Promise<Profile[]> => {
      return profileProvider.getProfiles();
    },
  },
};

export { profileResolver };
