import { ObjectId } from 'mongodb';

interface Profile {
  id: ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
}

interface CreateProfileInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  preferredGender: string;
}

interface UpdateProfileInput {
  id: ObjectId;
  password?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  isActive?: boolean | null;
}

export { Profile, CreateProfileInput, UpdateProfileInput };
