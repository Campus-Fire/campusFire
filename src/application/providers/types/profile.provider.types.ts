import { ObjectId } from 'mongodb';

interface Profile {
  id: ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
}

interface CreateProfileInput {
  id: ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  preferredGender: string;
}

interface UpdateProfileInput {
  id: ObjectId;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  isActive?: boolean | null;
}

export { Profile, CreateProfileInput, UpdateProfileInput };
