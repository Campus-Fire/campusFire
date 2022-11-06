import { Collection } from 'mongodb';

import { AccountDocument, toAccountObject } from '../../../src/entities/account.entity';
import { Account } from './types/account.provider.types';

class AccountProvider {
  constructor(private collection: Collection<AccountDocument>) {}

  public async getAccounts(): Promise<Account[]> {
    const accounts = await this.collection.find().toArray();

    return accounts.map(toAccountObject);
  }

  private async userWithEmailExists(email: string): Promise<void> {
    const data = await this.collection.countDocuments({ email: email });

    if (data && data > 0) {
      throw new Error(`User with ${email} email already exists`);
    }
  }
}

export { AccountProvider };
