import { Document } from 'mongodb';

import { Account } from '../../src/application/providers/types/account.provider.types';

interface AccountDocument extends Document, Omit<Account, 'id'> {}

const toAccountObject = (account: AccountDocument): Account => {
  return {
    id: account._id.toHexString(),
    email: account.email,
    password: account.password,
    isVerified: account.isVerified,
    createdAt: account.createdAt,
  };
};

export { AccountDocument, toAccountObject };
