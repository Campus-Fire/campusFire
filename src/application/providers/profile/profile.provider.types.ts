import { ObjectId } from 'mongodb';

import { Gender } from '../../../application/schema/types/schema';

interface Profile {
  id: ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  tagline: string;
  about: string;
  instituteId: ObjectId;
  faculty: string;
  location: string;
  isActive: boolean;
}

interface CreateProfileInput {
  id: ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  tagline: string;
  about: string;
  faculty: string;
  location: string;
  preferredGender: Gender;
}

interface UpdateProfileInput {
  id: ObjectId;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  tagline?: string | null;
  about?: string | null;
  faculty?: string | null;
  isActive?: boolean | null;
}

export { Profile, CreateProfileInput, UpdateProfileInput };
