import checkAuth from '../../helpers/check-auth';
import { verifyJWToken } from '../../helpers/token-helper';
import { accountProvider } from '../indexes/providers.index';
import {
  Account,
  MutationForgotPasswordRequestArgs,
  MutationLoginArgs,
  MutationRegisterAccountArgs,
  MutationResetPasswordArgs,
  MutationVerifyAccountPasswordResetArgs,
  MutationVerifyAccountRegistrationArgs,
  QueryRefreshTokenArgs,
} from '../schema/types/schema';
import { Root, SessionUser, UserContext } from '../schema/types/types';

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

    refreshToken: async (_: Root, args: QueryRefreshTokenArgs, context: UserContext): Promise<Account | null> => {
      const session = checkAuth(context);

      const { id, email } = verifyJWToken(args.token);
      if (session.user.id !== id || session.user.email !== email) {
        return null;
      }

      return accountProvider.getAccountById(session.user.id);
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
      const input = {
        ...session.user,
        ...args.input,
      };

      return accountProvider.verifyAccountRegistration(input);
    },

    resendVerificationCode: async (_: Root, _args: any, context: UserContext): Promise<boolean> => {
      const session = checkAuth(context);

      return accountProvider.resendVerificationCode(session.user.email);
    },

    forgotPasswordRequest: async (_: Root, args: MutationForgotPasswordRequestArgs): Promise<string> => {
      return accountProvider.sendForgotPasswordRequest(args.input.email);
    },

    verifyAccountPasswordReset: async (_: Root, args: MutationVerifyAccountPasswordResetArgs): Promise<boolean> => {
      const sessionUser = verifyJWToken(args.input.token) as SessionUser;

      const input = {
        ...sessionUser,
        ...args.input,
      };

      return accountProvider.verifyAccountPasswordReset(input);
    },

    resetPassword: async (_: Root, args: MutationResetPasswordArgs): Promise<Account> => {
      const sessionUser = verifyJWToken(args.input.token) as SessionUser;

      const input = {
        ...sessionUser,
        ...args.input,
      };

      return accountProvider.resetPassword(input);
    },

    deleteAccount: async (_: Root, _args: any, context: UserContext): Promise<boolean> => {
      const session = checkAuth(context);

      return accountProvider.deleteAccount(session.user.id);
    },
  },
};

export { accountResolver };
