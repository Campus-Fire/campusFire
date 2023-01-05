import { preferenceProvider } from '../indexes/provider';
import { Preference } from '../schema/types/schema';

const preferenceResolver = {
  Query: {
    preference: async (): Promise<Preference[]> => {
      return preferenceProvider.getAllPreferences();
    },
  },
  /*
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
    */
};

export { preferenceResolver };
