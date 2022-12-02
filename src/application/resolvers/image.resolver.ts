import { ExpressContext } from 'apollo-server-express';

import checkAuth from '../../helpers/check-auth';
import { imageProvider } from '../indexes/provider';
import { MutationUploadImageArgs } from '../schema/types/schema';
import { Root } from '../schema/types/types';

const imageResolver = {
  Mutation: {
    async uploadImage(_: Root, args: MutationUploadImageArgs, context: ExpressContext): Promise<string> {
      const tokenAuth = checkAuth(context);
      const input = { ...tokenAuth, ...args.input };

      return imageProvider.uploadImage(input);
    },
  },
};

export { imageResolver };
