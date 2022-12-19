import { UserInputError } from 'apollo-server';
import bcrypt from 'bcryptjs';
import { Collection, ObjectId } from 'mongodb';

import { AccountDocument, toAccountObject } from '../../../entities/account.entity';
import deterministicId from '../../../helpers/deterministic-id';
import { sendVerificationEmail, sendPasswordResetEmail } from '../../../helpers/email-verification';
import { generateToken, generateResetPasswortToken } from '../../../helpers/token-generator';
import { validateEmailInput, validatePasswordInput } from '../../../helpers/validator';
import getVerificationCode from '../../../helpers/verification-code';
import { instituteProvider } from '../../indexes/provider';
import {
  LoginInput,
  RegisterAccountInput,
  ResetPasswordInput,
  SecureAccount,
  TokenizedAccount,
  VerificationCodeInput,
} from './account.provider.types';

class AccountProvider {
  constructor(private collection: Collection<AccountDocument>) {}

  public async getAccounts(): Promise<SecureAccount[]> {
    const accounts = await this.collection.find().toArray();

    return accounts.map(toAccountObject);
  }

  public async login(input: LoginInput): Promise<TokenizedAccount> {
    const { email, password } = input;

    const userEmail = email.toLowerCase();

    validateEmailInput(userEmail);
    validatePasswordInput(password);

    // Could set wrong login date in case of wrong passwords
    const accountData = await this.collection.findOneAndUpdate(
      { email: userEmail },
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
    const { email, password } = input;

    const userEmail = email.toLowerCase();

    validateEmailInput(userEmail);
    validatePasswordInput(password);

    const userId = deterministicId(userEmail);
    if (await this.isExistingUser(userId)) {
      throw new UserInputError('User already exists. Please try logging in.');
    }

    await instituteProvider.isValidEmailExtension(userEmail);

    // might need a better hashing algorithm here
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = getVerificationCode();
    const accountData = await this.collection.insertOne({
      _id: userId,
      email: userEmail,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      isVerified: false,
      verificationCode,
    });

    const account = await this.collection.findOne({ _id: accountData.insertedId });
    if (!account) {
      throw new Error('Failed to create the account.');
    }

    sendVerificationEmail(userEmail, verificationCode);

    const document = toAccountObject(account);
    const token = generateToken({ id: account._id, email: account.email });

    return {
      token,
      ...document,
    };
  }

  public async verifyAccountRegistration(input: VerificationCodeInput): Promise<boolean> {
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

  public async resendVerificationCode(email: string): Promise<boolean> {
    validateEmailInput(email);

    const verificationCode = getVerificationCode();
    const accountData = await this.collection.findOneAndUpdate(
      { email },
      { $set: { ...{ verificationCode } } },
      { returnDocument: 'after' }
    );

    const account = accountData.value;
    if (!account) {
      throw new Error('Unable to send new Verification code.');
    }

    sendVerificationEmail(email, verificationCode);

    return account.verificationCode === verificationCode;
  }

  public async sendForgotPasswordRequest(email: string): Promise<string> {
    const userEmail = email.toLowerCase();
    const userId = deterministicId(email);

    if (!(await this.isExistingUser(userId))) {
      throw new UserInputError('Can not find a user with that email.');
    }

    const code = getVerificationCode();
    const token = generateResetPasswortToken({ id: userId, email: userEmail });

    const accountData = await this.collection.findOneAndUpdate(
      { _id: userId },
      { $set: { ...{ passwordResetCode: code } } },
      { returnDocument: 'after' }
    );

    const account = accountData.value;
    if (!account) {
      throw new Error('Unable to send password verification code');
    }

    sendPasswordResetEmail(userEmail, code);

    return token;
  }

  public async verifyAccountPasswordReset(input: VerificationCodeInput): Promise<boolean> {
    const { id, email, code } = input;

    const userId = new ObjectId(id);
    if (!(await this.isExistingUser(userId))) {
      throw new UserInputError('User does not exists');
    }

    const data = await this.collection.findOne({ _id: userId, passwordResetCode: code });

    return data?.email === email;
  }

  public async resetPassword(input: ResetPasswordInput): Promise<TokenizedAccount> {
    const { id, email, password, confirmPassword } = input;

    if (password !== confirmPassword) {
      throw new UserInputError('Passwords do not match.');
    }
    validatePasswordInput(password);
    validatePasswordInput(confirmPassword);

    const userId = new ObjectId(id);

    // might need a better hashing algorithm here
    const hashedPassword = await bcrypt.hash(password, 12);
    const accountData = await this.collection.findOneAndUpdate(
      { _id: userId, email },
      { $set: { ...{ password: hashedPassword } } },
      { returnDocument: 'after' }
    );

    const account = accountData.value;
    if (!account) {
      throw new UserInputError('Unable to update your password. Please try again!');
    }

    const token = generateToken({ id: account._id, email: account.email });
    const document = toAccountObject(account);

    return {
      token,
      ...document,
    };
  }
}

export { AccountProvider };
