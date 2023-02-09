import { ObjectId } from 'mongodb';

export interface Institute {
  id: ObjectId;
  name: string;
  emailExt: string;
  city: string;
  province: string;
  country: string;
}
