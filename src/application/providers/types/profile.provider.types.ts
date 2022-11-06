import { ObjectId } from 'mongodb';

interface Profile {
  id: ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
}

interface UpdateProfileInput {
  id: ObjectId;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  isActive?: boolean | null;
}

export { Profile, UpdateProfileInput };
