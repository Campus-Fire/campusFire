import { Collection, ObjectId } from 'mongodb';
import { profileProvider } from '../indexes/providers.index';
import { ImageDocument, toImageObject } from '../repositories/image.repository';
import { validateStringInputs } from '../../helpers/validator';
import { ImageInput, UploadMultipleImageInput, UploadSingleImageInput } from '../models/image.model';

class ImageProvider {
  constructor(private collection: Collection<ImageDocument>) {}

  public async uploadImage(input: UploadSingleImageInput): Promise<string> {
    const { id, imgSrc } = input;
    const userId = new ObjectId(id);
    validateStringInputs(imgSrc);

    const data = await this.collection.insertOne({
      _id: new ObjectId(),
      userId,
      src: imgSrc,
      isPrimary: false,
      addedAt: new Date(),
    });
    if (!data) {
      throw new Error('Failed to upload the image');
    }

    return data.insertedId.toString();
  }

  public async uploadMultipleImages(input: UploadMultipleImageInput): Promise<string[]> {
    const { id, email, imgSources } = input;

    const uploadedIds = [];

    for (let imgSrc of imgSources) {
      uploadedIds.push(
        await this.uploadImage({
          id,
          email,
          imgSrc,
        })
      );
    }

    return uploadedIds;
  }

  public async setPrimaryImage(input: ImageInput): Promise<string> {
    const { id, imgId } = input;

    const imageId = new ObjectId(imgId);
    const userId = new ObjectId(id);

    const imageData = await this.collection.findOneAndUpdate(
      { _id: imageId, userId },
      {
        $set: { ...{ isPrimary: true } },
      }
    );
    if (!imageData.value) {
      throw new Error('Could not find the image with provided id.');
    }

    const selectedImageId = imageData.value._id;

    profileProvider.setMainImage(userId, selectedImageId);

    return selectedImageId.toHexString();
  }

  public async getUserImages(userId: ObjectId): Promise<string[]> {
    const images = await this.collection
      .find({
        userId: userId,
      })
      .toArray();

    const imageSources = images.map((img) => {
      return toImageObject(img).src;
    });

    return imageSources;
  }
}

export { ImageProvider };
