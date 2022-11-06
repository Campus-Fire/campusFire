import { preferenceProvider } from '../providers';
import { Preference } from '../schema/types/schema';

const preferenceResolver = {
  Query: {
    preference: async (): Promise<Preference[]> => {
      return preferenceProvider.getAllPreferences();
    },
  },
};

export { preferenceResolver };
