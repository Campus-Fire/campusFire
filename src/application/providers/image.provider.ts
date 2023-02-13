import { Collection, ObjectId } from 'mongodb';
import { validateStringInputs } from '../../helpers/validator';
import { CFError } from '../../lib/errors-handler';
import { profileProvider } from '../indexes/providers.index';
import { Image, ImageInput, UploadMultipleImageInput, UploadSingleImageInput } from '../models/image.model';
import { ImageDocument, toImageObject } from '../repositories/image.repository';

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
      throw new CFError('IMAGE_UPLOAD_FAILED');
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
      { $set: { ...{ isPrimary: true } } },
      { returnDocument: 'after' }
    );
    if (!imageData.value) {
      throw new CFError('IMAGE_NOT_FOUND');
    }

    const selectedImageId = imageData.value._id;

    await profileProvider.setMainImage(userId, selectedImageId);

    return selectedImageId.toHexString();
  }

  public async getMainImage(id: ObjectId): Promise<Image> {
    const userId = new ObjectId(id);

    const mainImage = await this.collection.findOne({ userId, isPrimary: true });
    if (!mainImage) {
      throw new CFError('IMAGE_NOT_FOUND');
    }

    return toImageObject(mainImage);
  }

  public async getOtherImages(id: ObjectId): Promise<Image[]> {
    const userId = new ObjectId(id);

    const otherImages = await this.collection.find({ userId, isPrimary: false }).toArray();
    if (!otherImages) {
      throw new CFError('IMAGE_NOT_FOUND');
    }

    return otherImages.map(toImageObject);
  }
}

export { ImageProvider };
