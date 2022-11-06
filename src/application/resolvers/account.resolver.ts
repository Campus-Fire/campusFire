import { accountProvider } from '../providers';
import { Account } from '../schema/types/schema';

const accountResolver = {
  Query: {
    accounts: async (): Promise<Account[]> => {
      return accountProvider.getAccounts();
    },
  },
};

export { accountResolver };
