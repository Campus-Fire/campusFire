import { instituteProvider } from '../indexes/provider';
import { Institute } from '../schema/types/schema';

const instituteResolver = {
  Query: {
    institutes: async (): Promise<Institute[]> => {
      return instituteProvider.getInstitutes();
    },
  },
};

export { instituteResolver };
