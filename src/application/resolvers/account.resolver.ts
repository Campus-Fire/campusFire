import { accountProvider } from '../providers';
import { Account, LoginInput, RegisterAccountInput } from '../schema/types/schema';
import { Root } from '../schema/types/types';

interface UntokenizedAccount extends Omit<Account, 'token'> {}

const accountResolver = {
  Query: {
    accounts: async (): Promise<UntokenizedAccount[]> => {
      return accountProvider.getAccounts();
    },
  },

  Mutation: {
    login: async (_: Root, args: { input: LoginInput }): Promise<Account> => {
      return accountProvider.login(args.input);
    },
    registerAccount: async (_: Root, args: { input: RegisterAccountInput }): Promise<Account> => {
      return accountProvider.registerAccount(args.input);
    },
  },
};

export { accountResolver };
