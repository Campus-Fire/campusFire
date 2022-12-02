import { ExpressContext } from 'apollo-server-express';

import checkAuth from '../../helpers/check-auth';
import { accountProvider } from '../indexes/provider';
import {
  Account,
  MutationLoginArgs,
  MutationRegisterAccountArgs,
  MutationResetPasswordArgs,
  MutationUpdatePasswordArgs,
  MutationVerifyAccountArgs,
} from '../schema/types/schema';
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

    async verifyAccount(_: Root, args: MutationVerifyAccountArgs, context: ExpressContext): Promise<boolean> {
      const tokenAuth = checkAuth(context);
      const input = { ...tokenAuth, ...args.input };

      return accountProvider.verifyAccount(input);
    },

    async resendVerificationCode(_: Root, args: any, context: ExpressContext): Promise<boolean> {
      const { email } = checkAuth(context);

      return accountProvider.resendVerificationCode(email);
    },

    async resetPassword(_: Root, args: MutationResetPasswordArgs): Promise<boolean> {
      return accountProvider.resetPassword(args.input.email);
    },

    async updatePassword(_: Root, args: MutationUpdatePasswordArgs): Promise<Account> {
      return accountProvider.updatePassword(args.input);
    },
  },
};

export { accountResolver };
