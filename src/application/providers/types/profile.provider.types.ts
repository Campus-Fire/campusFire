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

export { Profile, CreateProfileInput };
