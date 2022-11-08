import { ObjectId } from 'mongodb';

interface Account {
  id: ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
}

interface CreateAccountInput {
  email: string;
  password: string;
}

export { Account, CreateAccountInput };
