import { Institute } from '../schema/types/schema';
import { instituteProvider } from '../providers';

const instituteResolver = {
  Query: {
    async institutes(): Promise<Institute[]> {
      return instituteProvider.getInstitutes();
    },
  },
};

export { instituteResolver };
