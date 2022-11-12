import { preferenceProvider } from '../providers';
import { Preference } from '../schema/types/schema';

const preferenceResolver = {
  Query: {
    async preference(): Promise<Preference[]> {
      return preferenceProvider.getAllPreferences();
    },
  },
};

export { preferenceResolver };
