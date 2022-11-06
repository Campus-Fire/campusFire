import { instituteProvider } from '../providers';
import { Institute } from '../schema/types/schema';

const instituteResolver = {
  Query: {
    institutes: async (): Promise<Institute[]> => {
      return instituteProvider.getInstitutes();
    },
  },
};

export { instituteResolver };
