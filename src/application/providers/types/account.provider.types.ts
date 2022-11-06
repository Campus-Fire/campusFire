import { ObjectId } from 'mongodb';

interface Account {
  id: ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
}

export { Account };
