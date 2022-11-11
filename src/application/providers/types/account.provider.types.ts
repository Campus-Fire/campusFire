import { ObjectId } from 'mongodb';

interface Account {
  id: ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

interface SecureAccount extends Omit<Account, 'password'> {}

interface TokenizedAccount extends SecureAccount {
  token: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface RegisterAccountInput {
  email: string;
  password: string;
  confirmPassword: string;
}

export { Account, SecureAccount, TokenizedAccount, LoginInput, RegisterAccountInput };
