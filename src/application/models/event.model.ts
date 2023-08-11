import { ObjectId } from 'mongodb';
import { Profile } from './profile.model';

export interface Event {
  id: ObjectId;
  ownerId: ObjectId;
  name: string;
  startDate: Date;
  endDate: Date;
  city: string;
  province: string;
  country: string;
  description: string;
  isVerified?: boolean | null;
  isUserUploaded: boolean;
  meetUpLocation: string;
  attendance: Profile[];
  cost: number;
  category: Category;
}

export enum Category {
  Casual = 'CASUAL',
  Club = 'CLUB',
  Conference = 'CONFERENCE',
  Festival = 'FESTIVAL',
  Formal = 'FORMAL',
  OffCampus = 'OFF_CAMPUS',
  OnCampus = 'ON_CAMPUS',
  Recurring = 'RECURRING',
  SocialNight = 'SOCIAL_NIGHT',
  Sports = 'SPORTS',
  Volunteering = 'VOLUNTEERING',
}

export interface UpdateEventDetailsInput {
  eventId: ObjectId;
  ownerId: ObjectId;
  name?: String | null;
  startDate?: Date | null;
  endDate?: Date | null;
  city?: String | null;
  province?: String | null;
  country?: String | null;
  description?: String | null;
  meetUpLocation?: String | null;
  cost?: number | null;
  category?: Category | null;
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
