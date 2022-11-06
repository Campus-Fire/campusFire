import { ObjectId } from 'mongodb';

interface Institute {
  id: ObjectId;
  name: string;
  emailExt: String;
  userIds?: ObjectId[];
}

export { Institute };
