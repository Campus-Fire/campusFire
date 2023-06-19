import { ObjectId } from 'mongodb';
import { Profile } from './profile.model';

export interface Event {
  id: ObjectId;
  ownerId: ObjectId;
  name: string;
  date: Date;
  city: string;
  province: string;
  country: string;
  description: string;
  isVerified?: boolean | null;
  isUserUploaded: boolean;
  meetUpLocation: string;
  attendance: Profile[];
}

export interface UpdateEventDetailsInput {
  eventId: ObjectId;
  ownerId: ObjectId;
  name?: String | null;
  date?: Date | null;
  city?: String | null;
  province?: String | null;
  country?: String | null;
  description?: String | null;
  meetUpLocation?: String | null;
}

export interface UpdateVerificationInput {
  eventId: ObjectId;
  isVerified: Boolean;
}

export interface UpdateAttendanceInput {
  eventId: ObjectId;
  isAttending: Boolean;
  userProfile: Profile;
}

export type CreateEventInput = Omit<Event, 'id'>;
