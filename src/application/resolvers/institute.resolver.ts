import { instituteProvider } from '../providers';
import { Institute } from '../schema/types/schema';

const instituteResolver = {
  Query: {
    async institutes(): Promise<Institute[]> {
      return instituteProvider.getInstitutes();
    },
  },
};

export { instituteResolver };
