import { ObjectId } from 'mongodb';

interface Preference {
  userId: ObjectId;
  gender: string;
  likes?: ObjectId[];
}

export { Preference };
