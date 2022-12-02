import { ObjectId } from 'mongodb';

interface Image {
  id: ObjectId;
  userId: ObjectId;
  src: string;
}

interface UploadImageInput {
  id: ObjectId;
  email: string;
  imgSrc: string;
}

export { Image, UploadImageInput };
