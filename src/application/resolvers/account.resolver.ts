import { ExpressContext } from 'apollo-server-express';

import checkAuth from '../../helpers/check-auth';
import { accountProvider } from '../indexes/provider';
import {
  Account,
  MutationForgotPasswordRequestArgs,
  MutationLoginArgs,
  MutationRegisterAccountArgs,
  MutationResetPasswordArgs,
  MutationVerifyAccountRegistrationArgs,
} from '../schema/types/schema';
import { Root } from '../schema/types/types';

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

    async verifyAccountRegistration(_: Root, args: MutationVerifyAccountRegistrationArgs, context: ExpressContext): Promise<boolean> {
      const tokenAuth = checkAuth(context);
      const input = { ...tokenAuth, ...args.input };

      return accountProvider.verifyAccountRegistration(input);
    },

    async resendVerificationCode(_: Root, args: any, context: ExpressContext): Promise<boolean> {
      const { email } = checkAuth(context);

      return accountProvider.resendVerificationCode(email);
    },

    async forgotPasswordRequest(_: Root, args: MutationForgotPasswordRequestArgs): Promise<boolean> {
      return accountProvider.sendForgotPasswordRequest(args.input.email)
    },

    async resetPassword(_: Root, args: MutationResetPasswordArgs, context: ExpressContext): Promise<Account> {
      const tokenAuth = checkAuth(context);
      const input = { ...tokenAuth, ...args.input };

      return accountProvider.resetPassword(input);
    }
  },
};

export { accountResolver };
