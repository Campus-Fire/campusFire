import { Collection, ObjectId } from 'mongodb';

import { validateStringInputs } from '../../../helpers/validator';
import { ImageDocument } from '../../../entities/image.entity';
import { UploadImageInput } from './image.provider.types';

class ImageProvider {
  constructor(private collection: Collection<ImageDocument>) {}

  public async uploadImage(input: UploadImageInput): Promise<string> {
    const { id, imgSrc } = input;
    const userId = new ObjectId(id);
    validateStringInputs(imgSrc);

    const data = await this.collection.insertOne({
      _id: new ObjectId(),
      userId,
      src: imgSrc,
    });
    if (!data) {
      throw new Error('Failed to upload the image');
    }

    return data.insertedId.toString();
  }
}

export { ImageProvider };
