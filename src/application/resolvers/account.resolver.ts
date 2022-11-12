import { accountProvider } from '../providers';
import { Account, MutationLoginArgs, MutationRegisterAccountArgs } from '../schema/types/schema';
import { Root } from '../schema/types/types';

interface UntokenizedAccount extends Omit<Account, 'token'> {}

const accountResolver = {
  Query: {
    async accounts(): Promise<UntokenizedAccount[]> {
      return accountProvider.getAccounts();
    },
  },

  Mutation: {
    async login(_: Root, args: MutationLoginArgs): Promise<Account> {
      return accountProvider.login(args.input);
    },

    async registerAccount(_: Root, args: MutationRegisterAccountArgs): Promise<Account> {
      return accountProvider.registerAccount(args.input);
    },
  },
};

export { accountResolver };
