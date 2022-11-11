import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import { Collection } from 'mongodb';

import { instituteProvider } from '../index';
import { AccountDocument, toAccountObject } from '../../../../src/entities/account.entity';
import deterministicId from '../../../../src/lib/deterministic-id';
import generateToken from '../../helpers/token-generator.helper';
import { validateEmailInput, validatePasswordInput } from '../../helpers/validator.helper';
import { Account, RegisterAccountInput, TokenizedAccount } from '../types/account.provider.types';

class AccountProvider {
  constructor(private collection: Collection<AccountDocument>) {}

  public async getAccounts(): Promise<Account[]> {
    const accounts = await this.collection.find().toArray();

    return accounts.map(toAccountObject);
  }

  public async registerAccount(input: RegisterAccountInput): Promise<TokenizedAccount> {
    const { email, password, confirmPassword } = input;

    if (password !== confirmPassword) {
      throw new UserInputError('Passwords do not match.');
    }

    validateEmailInput(email);
    validatePasswordInput(password);
    validatePasswordInput(confirmPassword);

    await instituteProvider.isValidEmailExtension(email);
    await this.userWithEmailExists(email);

    const userId = deterministicId(email);
    const hashedPassword = await bcrypt.hash(password, 12);

    const accountData = await this.collection.insertOne({
      _id: userId,
      email: email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isVerified: false,
    });

    const account = await this.collection.findOne({ _id: accountData.insertedId });

    if (!account) {
      throw new Error('Failed to create the account.');
    }

    const document = toAccountObject(account);
    const token = generateToken({ id: account._id, email: account.email });

    return {
      token,
      ...document,
    };
  }

  private async userWithEmailExists(email: string): Promise<void> {
    const data = await this.collection.countDocuments({ email: email });

    if (data && data > 0) {
      throw new Error(`User with ${email} email already exists.`);
    }
  }
}

export { AccountProvider };
