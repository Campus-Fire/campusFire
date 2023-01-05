import checkAuth from '../../helpers/check-auth';
import { accountProvider } from '../indexes/provider';
import {
  Account,
  MutationForgotPasswordRequestArgs,
  MutationLoginArgs,
  MutationRegisterAccountArgs,
  MutationResetPasswordArgs,
  MutationVerifyAccountPasswordResetArgs,
  MutationVerifyAccountRegistrationArgs,
} from '../schema/types/schema';
import { Root, UserContext } from '../schema/types/types';

interface UntokenizedAccount extends Omit<Account, 'token'> {}

const accountResolver = {
  Query: {
    accounts: async (): Promise<UntokenizedAccount[]> => {
      return accountProvider.getAccounts();
    },

    termsOfUse: async (): Promise<string> => {
      return 'returnsTermsOfUsePageURL';
    },

    privacyPolicy: async (): Promise<string> => {
      return 'returnsPrivacyPolicyPageURL';
    },
  },

  Mutation: {
    login: async (_: Root, args: MutationLoginArgs): Promise<Account> => {
      return accountProvider.login(args.input);
    },

    registerAccount: async (_: Root, args: MutationRegisterAccountArgs): Promise<Account> => {
      return accountProvider.registerAccount(args.input);
    },

    verifyAccountRegistration: async (
      _: Root,
      args: MutationVerifyAccountRegistrationArgs,
      context: UserContext
    ): Promise<boolean> => {
      const session = checkAuth(context);
      const input = { ...session.user, ...args.input };

      return accountProvider.verifyAccountRegistration(input);
    },

    resendVerificationCode: async (_: Root, _args: any, context: UserContext): Promise<boolean> => {
      const session = checkAuth(context);

      return accountProvider.resendVerificationCode(session.user.email);
    },

    forgotPasswordRequest: async (_: Root, args: MutationForgotPasswordRequestArgs): Promise<string> => {
      return accountProvider.sendForgotPasswordRequest(args.input.email);
    },

    verifyAccountPasswordReset: async (
      _: Root,
      args: MutationVerifyAccountPasswordResetArgs,
      context: UserContext
    ): Promise<boolean> => {
      const session = checkAuth(context);
      const input = { ...session.user, ...args.input };

      return accountProvider.verifyAccountPasswordReset(input);
    },

    resetPassword: async (_: Root, args: MutationResetPasswordArgs, context: UserContext): Promise<Account> => {
      const session = checkAuth(context);
      const input = { ...session.user, ...args.input };

      return accountProvider.resetPassword(input);
    },
  },
};

export { accountResolver };
