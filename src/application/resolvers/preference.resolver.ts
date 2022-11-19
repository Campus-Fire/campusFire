import { ExpressContext } from 'apollo-server-express';
import checkAuth from '../../helpers/check-auth';
import { preferenceProvider } from '../indexes/provider';
import { MutationDislikeUserProfileArgs, MutationLikeUserProfileArgs, Preference } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const preferenceResolver = {
  Query: {
    async preference(): Promise<Preference[]> {
      return preferenceProvider.getAllPreferences();
    },
  },

  Mutation: {
    async likeUserProfile(_: Root, args: MutationLikeUserProfileArgs, context: ExpressContext): Promise<Preference> {
      const { id } = checkAuth(context);
      const input = { id, ...args.input };

      return preferenceProvider.likeUserProfile(input);
    },

    async dislikeUserProfile(
      _: Root,
      args: MutationDislikeUserProfileArgs,
      context: ExpressContext
    ): Promise<Preference> {
      const { id } = checkAuth(context);
      const input = { id, ...args.input };

      return preferenceProvider.dislikeUserProfile(input);
    },
  },
};

export { preferenceResolver };
