// import { gql } from 'apollo-server-express';

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
  isVerified: boolean;
  isUserUploaded: boolean;
  meetUpLocation: string;
  attendance: Profile[];
}
