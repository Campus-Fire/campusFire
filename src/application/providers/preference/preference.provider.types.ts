import { ObjectId } from 'mongodb';

interface Preference {
  userId: ObjectId;
  gender: string;
  usersEncountered?: ObjectId[];
  liked?: ObjectId[];
  likedBy?: ObjectId[];
  disliked?: ObjectId[];
}

interface ProfileInteractionInput {
  id: ObjectId;
  profileId: ObjectId;
}

export { Preference, ProfileInteractionInput };
