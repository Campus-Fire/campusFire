import { ObjectId } from 'mongodb';

interface Account {
  id: ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: string;
}

interface TokenizedAccount extends Account {
  token: string;
}

interface RegisterAccountInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export { Account, TokenizedAccount, RegisterAccountInput };
