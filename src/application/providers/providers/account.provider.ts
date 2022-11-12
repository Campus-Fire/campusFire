import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import { Collection, ObjectId } from 'mongodb';

import { instituteProvider } from '../index';
import { AccountDocument, toAccountObject } from '../../../../src/entities/account.entity';
import deterministicId from '../../../../src/lib/deterministic-id';
import generateToken from '../../helpers/token-generator.helper';
import { validateEmailInput, validatePasswordInput } from '../../helpers/validator.helper';
import {
  LoginInput,
  RegisterAccountInput,
  SecureAccount,
  TokenizedAccount,
  VerificationCodeInput,
} from '../types/account.provider.types';
import getVerificationCode from '../../../../src/application/helpers/verification-code.helper';
import sendVerificationEmail from '../../../../src/application/helpers/email-verification.helper';

class AccountProvider {
  constructor(private collection: Collection<AccountDocument>) {}

  public async getAccounts(): Promise<SecureAccount[]> {
    const accounts = await this.collection.find().toArray();

    return accounts.map(toAccountObject);
  }

  public async login(input: LoginInput): Promise<TokenizedAccount> {
    const { email, password } = input;

    validateEmailInput(email);
    validatePasswordInput(password);

    const accountData = await this.collection.findOneAndUpdate(
      { email },
      { $set: { ...{ lastLogin: new Date().toISOString() } } },
      { returnDocument: 'after' }
    );

    const account = accountData.value;
    if (!account) {
      throw new UserInputError('Unable to retrieve an user with provided email.');
    }

    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) {
      throw new UserInputError('Wrong Credentials!');
    }

    const document = toAccountObject(account);
    const token = generateToken({ id: account._id, email: account.email });

    return {
      token,
      ...document,
    };
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

    const verificationCode = getVerificationCode();
    sendVerificationEmail(email, verificationCode);

    const userId = deterministicId(email);
    const hashedPassword = await bcrypt.hash(password, 12);

    const accountData = await this.collection.insertOne({
      _id: userId,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isVerified: false,
      verificationCode,
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

  public async verifyAccount(input: VerificationCodeInput): Promise<boolean> {
    const { id, email, code } = input;
    const userId = new ObjectId(id);

    const accountData = await this.collection.findOne({ _id: userId, email });
    if (!accountData) {
      throw new Error('Account not found');
    }

    if (accountData.verificationCode === Number(code)) {
      const data = await this.collection.findOneAndUpdate(
        { _id: userId, email },
        { $set: { ...{ isVerified: true } } },
        { returnDocument: 'after' }
      );
      if (!data.value) {
        throw new Error('Unable to verify the account');
      }

      return true;
    }

    return false;
  }

  private async userWithEmailExists(email: string): Promise<void> {
    const data = await this.collection.countDocuments({ email });
    if (data && data > 0) {
      throw new Error(`User with ${email} email already exists.`);
    }
  }
}

export { AccountProvider };
