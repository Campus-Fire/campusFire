import { ExpressContext } from 'apollo-server-express';

import {
  Account,
  MutationLoginArgs,
  MutationRegisterAccountArgs,
  MutationVerifyAccountArgs
} from '../schema/types/schema';
import { Root } from '../schema/types/types';
import checkAuth from '../helpers/check-auth';
import { accountProvider } from '../providers';

interface UntokenizedAccount extends Omit<Account, 'token'> { }

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

    async verifyAccount(_: Root, args: MutationVerifyAccountArgs, context: ExpressContext): Promise<boolean> {
      const { id, email } = checkAuth(context);
      const input = { id, email, ...args.input };

      return accountProvider.verifyAccount(input);
    },
  },
};

export { accountResolver };
