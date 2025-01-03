import { Document } from 'mongodb';
import { Account, SecureAccount } from '../models/account.model';

interface AccountDocument extends Document, Omit<Account, 'id'> {}

const toAccountObject = (account: AccountDocument): SecureAccount => {
  return {
    id: account._id.toHexString(),
    email: account.email,
    isVerified: account.isVerified,
    createdAt: account.createdAt,
    expiresAt: account.expiresAt,
    lastLogin: account.lastLogin,
    verificationCode: account.verificationCode,
    passwordResetCode: account.passwordResetCode,
    flaggedDelete: account.flaggedDelete,
  };
};

export { AccountDocument, toAccountObject };
