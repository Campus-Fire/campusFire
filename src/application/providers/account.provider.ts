import { Collection } from 'mongodb';

import deterministicId from '../../../src/lib/deterministic-id';
import { AccountDocument, toAccountObject } from '../../../src/entities/account.entity';
import { Account, CreateAccountInput } from './types/account.provider.types';
import validateStringInputs from '../../../src/lib/string-validator';
import { instituteProvider } from '.';

class AccountProvider {
  constructor(private collection: Collection<AccountDocument>) {}

  public async getAccounts(): Promise<Account[]> {
    const accounts = await this.collection.find().toArray();

    return accounts.map(toAccountObject);
  }

  public async createAccount(input: CreateAccountInput): Promise<Account> {
    const { email, password } = input;

    const id = deterministicId(email);

    if (!email || !password) {
      throw new Error('Can not have empty email or password');
    }
    validateStringInputs(email);
    validateStringInputs(password);
    await this.userWithEmailExists(email);
    await instituteProvider.isValidEmailExtension(id, email);

    const data = await this.collection.insertOne({
      _id: id,
      email: email,
      password: password,
      isVerified: false,
    });

    const account = await this.collection.findOne({ _id: data.insertedId });

    if (!account) {
      throw new Error(`Could not create ${email} account`);
    }

    return toAccountObject(account);
  }

  private async userWithEmailExists(email: string): Promise<void> {
    const data = await this.collection.countDocuments({ email: email });

    if (data && data > 0) {
      throw new Error(`User with ${email} email already exists`);
    }
  }
}

export { AccountProvider };
