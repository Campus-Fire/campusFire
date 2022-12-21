import { ObjectId } from 'mongodb';

interface Image {
  id: ObjectId;
  userId: ObjectId;
  src: string;
  isPrimary: boolean;
  addedAt: Date;
}

interface UploadSingleImageInput {
  id: ObjectId;
  email: string;
  imgSrc: string;
}

interface UploadMultipleImageInput {
  id: ObjectId;
  email: string;
  imgSources: string[];
}

interface ImageInput {
  id: ObjectId;
  imgId: ObjectId;
}


export { Image, UploadSingleImageInput, UploadMultipleImageInput, ImageInput };
