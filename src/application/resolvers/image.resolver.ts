import { ExpressContext } from 'apollo-server-express';

import checkAuth from '../../helpers/check-auth';
import { imageProvider } from '../indexes/provider';
import {
  MutationUploadSingleImageArgs,
  MutationUploadMultipleImagesArgs,
  MutationSetPrimaryImageArgs,
} from '../schema/types/schema';
import { Root } from '../schema/types/types';

const imageResolver = {
  Mutation: {
    async uploadSingleImage(_: Root, args: MutationUploadSingleImageArgs, context: ExpressContext): Promise<string> {
      const tokenAuth = checkAuth(context);
      const input = { ...tokenAuth, ...args.input };

      return imageProvider.uploadImage(input);
    },

    async uploadMultipleImages(
      _: Root,
      args: MutationUploadMultipleImagesArgs,
      context: ExpressContext
    ): Promise<string[]> {
      const tokenAuth = checkAuth(context);
      const input = { ...tokenAuth, ...args.input };

      return imageProvider.uploadMultipleImages(input);
    },

    async setPrimaryImage(_: Root, args: MutationSetPrimaryImageArgs, context: ExpressContext): Promise<string> {
      const tokenAuth = checkAuth(context);
      const input = { ...tokenAuth, ...args.input };

      return imageProvider.setPrimaryImage(input);
    },
  },
};

export { imageResolver };
