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
  mainImage?: string;
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
