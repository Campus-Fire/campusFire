import { Document } from 'mongodb';

import { Image } from '../application/providers/image/image.provider.types';

interface ImageDocument extends Document, Omit<Image, 'id'> {}

const toImageObject = (image: ImageDocument): Image => {
  return {
    id: image._id.toHexString(),
    userId: image.userId,
    src: image.src,
    isPrimary: image.isPrimary,
    addedAt: image.addedAt,
  };
};

export { ImageDocument, toImageObject };
