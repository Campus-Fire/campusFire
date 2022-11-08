import { accountProvider } from '../providers';
import { Account, CreateAccountInput } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const accountResolver = {
  Query: {
    accounts: async (): Promise<Account[]> => {
      return accountProvider.getAccounts();
    },
  },

  Mutation: {
    createAccount: async (_: Root, args: { input: CreateAccountInput }): Promise<Account> => {
      return accountProvider.createAccount(args.input);
    },
  },
};

export { accountResolver };
