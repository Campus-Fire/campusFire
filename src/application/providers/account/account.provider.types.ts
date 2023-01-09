import { ObjectId } from 'mongodb';

interface Account {
  id: ObjectId;
  email: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  expiresAt: Date;
  lastLogin?: Date;
  verificationCode?: string;
  passwordResetCode?: string;
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
}

interface VerificationCodeInput {
  id: ObjectId;
  email: string;
  code: string;
}

interface ResetPasswordInput {
  id: ObjectId;
  email: string;
  password: string;
  confirmPassword: string;
}

export {
  Account,
  SecureAccount,
  TokenizedAccount,
  LoginInput,
  RegisterAccountInput,
  VerificationCodeInput,
  ResetPasswordInput,
};
