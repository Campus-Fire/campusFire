import { ObjectId } from 'mongodb';
import { Profile } from './profile.model';

export interface Event {
  id: ObjectId;
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

export type CreateEventInput = Omit<Event, 'id' | 'attendance'>;
