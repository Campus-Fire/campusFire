import { ObjectId } from 'mongodb';

interface Institute {
  id: ObjectId;
  name: string;
  emailExt: string;
  userIds?: ObjectId[];
}

export { Institute };
