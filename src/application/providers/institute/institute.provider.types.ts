import { ObjectId } from 'mongodb';

interface Institute {
  id: ObjectId;
  name: string;
  emailExt: string;
  city: string;
  province: string;
  country: string;
  userIds?: ObjectId[];
}

export { Institute };
