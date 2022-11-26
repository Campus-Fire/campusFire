import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import { Collection, ObjectId } from 'mongodb';

import { AccountDocument, toAccountObject } from '../../../entities/account.entity';
import deterministicId from '../../../helpers/deterministic-id';
import sendVerificationEmail from '../../../helpers/email-verification';
import generateToken from '../../../helpers/token-generator';
import { validateEmailInput, validatePasswordInput } from '../../../helpers/validator';
import getVerificationCode from '../../../helpers/verification-code';
import { instituteProvider } from '../../indexes/provider';
import {
  LoginInput,
  RegisterAccountInput,
  SecureAccount,
  TokenizedAccount,
  VerificationCodeInput,
} from './account.provider.types';

class AccountProvider {
  constructor(private collection: Collection<AccountDocument>) { }

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

    const userId = deterministicId(email);
    if (await this.isExistingUser(userId)) {
      throw new UserInputError('User already exists. Please try logging in.');
    }

    await instituteProvider.isValidEmailExtension(email);

    const verificationCode = getVerificationCode();
    sendVerificationEmail(email, verificationCode);

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
    const { id, code } = input;

    const userId = new ObjectId(id);
    if (!(await this.isExistingUser(userId))) {
      throw new UserInputError('User does not exists');
    }

    const data = await this.collection.findOneAndUpdate(
      { _id: userId, verificationCode: code },
      { $set: { ...{ isVerified: true } } },
      { returnDocument: 'after' }
    );
    if (!data.value) {
      throw new Error('Unable to verify the account');
    }

    return data.value.isVerified;
  }

  public async isAccountVerified(id: ObjectId): Promise<boolean> {
    const accountData = await this.collection.findOne({ _id: id });
    if (!accountData) {
      throw new Error('Corresponding account not found');
    }

    return accountData.isVerified;
  }

  public async isExistingUser(id: ObjectId): Promise<boolean> {
    const data = await this.collection.countDocuments({ _id: id });

    return data > 0;
  }
}

export { AccountProvider };
