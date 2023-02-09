import { ObjectId } from 'mongodb';

export interface Image {
  id: ObjectId;
  userId: ObjectId;
  src: string;
  isPrimary: boolean;
  addedAt: Date;
}

export interface UploadSingleImageInput {
  id: ObjectId;
  email: string;
  imgSrc: string;
}

export interface UploadMultipleImageInput {
  id: ObjectId;
  email: string;
  imgSources: string[];
}

export interface ImageInput {
  id: ObjectId;
  imgId: ObjectId;
}
