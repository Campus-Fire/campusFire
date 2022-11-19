import { Document } from 'mongodb';
import { Account, SecureAccount } from '../application/providers/account/account.provider.types';

interface AccountDocument extends Document, Omit<Account, 'id'> {}

const toAccountObject = (account: AccountDocument): SecureAccount => {
  return {
    id: account._id.toHexString(),
    email: account.email,
    isVerified: account.isVerified,
    createdAt: account.createdAt,
    lastLogin: account.lastLogin,
    verificationCode: account.verificationCode,
  };
};

export { AccountDocument, toAccountObject };
