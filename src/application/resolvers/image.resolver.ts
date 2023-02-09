import { profile } from 'console';
import checkAuth from '../../helpers/check-auth';
import { imageProvider } from '../indexes/providers.index';
import {
  Image,
  MutationSetPrimaryImageArgs,
  MutationUploadMultipleImagesArgs,
  MutationUploadSingleImageArgs,
} from '../schema/types/schema';
import { Root, UserContext } from '../schema/types/types';

const imageResolver = {
  Mutation: {
    uploadSingleImage: async (_: Root, args: MutationUploadSingleImageArgs, context: UserContext): Promise<string> => {
      const session = checkAuth(context);
      const input = {
        ...session.user,
        ...args.input,
      };

      return imageProvider.uploadImage(input);
    },

    uploadMultipleImages: async (
      _: Root,
      args: MutationUploadMultipleImagesArgs,
      context: UserContext
    ): Promise<string[]> => {
      const session = checkAuth(context);
      const input = {
        ...session.user,
        ...args.input,
      };

      return imageProvider.uploadMultipleImages(input);
    },

    setPrimaryImage: async (_: Root, args: MutationSetPrimaryImageArgs, context: UserContext): Promise<string> => {
      const session = checkAuth(context);
      const input = {
        ...session.user,
        ...args.input,
      };

      return imageProvider.setPrimaryImage(input);
    },
  },

  Profile: {
    mainImage: async (profile: any): Promise<Image> => {
      return imageProvider.getMainImage(profile.id);
    },

    otherImages: async (profile: any): Promise<Image[]> => {
      return imageProvider.getOtherImages(profile.id);
    },
  },
};

export { imageResolver };
