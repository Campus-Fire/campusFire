import { ObjectId } from 'mongodb';
import { Faculty, Gender, Interest } from '../schema/types/schema';

export interface Profile {
  id: ObjectId;
  instituteId: ObjectId;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  tagline: string;
  about: string;
  faculty: Faculty;
  interests: Interest[];
  onResidence: boolean;
  isActive: boolean;
}

export interface CreateProfileInput {
  id: ObjectId;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  tagline: string;
  about: string;
  faculty: Faculty;
  interests: Interest[];
  onResidence: boolean;
}

export interface UpdateProfileInput {
  id: ObjectId;
  firstName?: string | null;
  lastName?: string | null;
  dateOfBirth?: string | null;
  gender?: Gender | null;
  tagline?: string | null;
  about?: string | null;
  faculty?: Faculty | null;
  interests?: Interest[] | null;
  onResidence?: boolean | null;
}
