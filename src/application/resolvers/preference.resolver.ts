import { Preference } from '../schema/types/schema';
import { preferenceProvider } from '../providers';

const preferenceResolver = {
  Query: {
    async preference(): Promise<Preference[]> {
      return preferenceProvider.getAllPreferences();
    },
  },
};

export { preferenceResolver };
