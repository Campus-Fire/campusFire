import { ObjectId } from 'mongodb';

export interface Account {
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

export interface SecureAccount extends Omit<Account, 'password'> {}

export interface TokenizedAccount extends SecureAccount {
  token: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterAccountInput {
  email: string;
  password: string;
}

export interface VerificationCodeInput {
  id: ObjectId;
  email: string;
  code: string;
}

export interface ResetPasswordInput {
  id: ObjectId;
  email: string;
  password: string;
  confirmPassword: string;
}
