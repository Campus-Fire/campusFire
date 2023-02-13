import { UserInputError } from 'apollo-server-express';
import bcrypt from 'bcryptjs';
import { addYears, isAfter } from 'date-fns';
import { Collection, ObjectId } from 'mongodb';
import deterministicId from '../../helpers/deterministic-id';
import { sendPasswordResetEmail, sendVerificationEmail } from '../../helpers/email-verification';
import { generateResetPasswortToken, generateToken } from '../../helpers/token-helper';
import { validateEmailInput, validatePasswordInput } from '../../helpers/validator';
import getVerificationCode from '../../helpers/verification-code';
import { CFError } from '../../lib/errors-handler';
import { instituteProvider } from '../indexes/providers.index';
import {
  LoginInput,
  RegisterAccountInput,
  ResetPasswordInput,
  SecureAccount,
  TokenizedAccount,
  VerificationCodeInput,
} from '../models/account.model';
import { AccountDocument, toAccountObject } from '../repositories/account.repository';

class AccountProvider {
  constructor(private collection: Collection<AccountDocument>) {}

  public async getAccounts(): Promise<SecureAccount[]> {
    const accounts = await this.collection.find().toArray();

    return accounts.map(toAccountObject);
  }

  public async getAccountById(userId: string): Promise<TokenizedAccount> {
    const id = new ObjectId(userId);

    const accountData = await this.collection.findOne({ _id: id });
    if (!accountData) {
      throw new CFError('INVALID_CREDENTIALS');
    }

    const token = generateToken({
      id: accountData._id,
      email: accountData.email,
    });

    const document = toAccountObject(accountData);

    return {
      token,
      ...document,
    };
  }

  public async login(input: LoginInput): Promise<TokenizedAccount> {
    const { email, password } = input;

    const userEmail = email.toLowerCase();

    validateEmailInput(userEmail);
    validatePasswordInput(password);

    const now = new Date();

    const account = await this.collection.findOne({ email: userEmail });
    if (!account) {
      throw new CFError('INVALID_CREDENTIALS');
    }

    if (isAfter(now, account.expiresAt)) {
      throw new CFError('ACCOUNT_EXPIRED');
    }

    const passwordMatch = await bcrypt.compare(password, account.password);
    if (!passwordMatch) {
      throw new CFError('INVALID_CREDENTIALS');
    }

    const accountData = await this.collection.findOneAndUpdate(
      { email: userEmail },
      { $set: { ...{ lastLogin: now } } },
      { returnDocument: 'after' }
    );
    if (!accountData.value) {
      throw new Error('Unable to update account after login');
    }

    const document = toAccountObject(account);
    const token = generateToken({
      id: account._id,
      email: account.email,
    });

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
      throw new CFError('ACCOUNT_ALREADY_EXISTS');
    }

    await instituteProvider.isValidEmailExtension(userEmail);

    // might need a better hashing algorithm here
    const hashedPassword = await bcrypt.hash(password, 12);
    const verificationCode = getVerificationCode();
    const now = new Date();

    const accountData = await this.collection.insertOne({
      _id: userId,
      email: userEmail,
      password: hashedPassword,
      createdAt: now,
      expiresAt: addYears(now, 4),
      isVerified: false,
      verificationCode,
    });

    const account = await this.collection.findOne({ _id: accountData.insertedId });
    if (!account) {
      throw new Error('Failed to create the account.');
    }

    sendVerificationEmail(userEmail, verificationCode);

    const document = toAccountObject(account);
    const token = generateToken({
      id: account._id,
      email: account.email,
    });

    return {
      token,
      ...document,
    };
  }

  public async verifyAccountRegistration(input: VerificationCodeInput): Promise<boolean> {
    const { id, code } = input;

    const userId = new ObjectId(id);
    if (!(await this.isExistingUser(userId))) {
      throw new CFError('ACCOUNT_NOT_FOUND');
    }

    const data = await this.collection.findOneAndUpdate(
      { _id: userId, verificationCode: code },
      { $set: { ...{ isVerified: true } } },
      { returnDocument: 'after' }
    );
    if (!data.value) {
      throw new CFError('INVALID_VERIFICATION_CODE');
    }

    return data.value.isVerified;
  }

  public async isAccountVerified(id: ObjectId): Promise<boolean> {
    const userId = new ObjectId(id);
    const accountData = await this.collection.findOne({ _id: userId });
    if (!accountData) {
      throw new CFError('ACCOUNT_NOT_FOUND');
    }

    return accountData.isVerified;
  }

  public async isExistingUser(id: ObjectId): Promise<boolean> {
    const userId = new ObjectId(id);
    const data = await this.collection.countDocuments({ _id: userId });

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
    const userId = deterministicId(userEmail);

    if (!(await this.isExistingUser(userId))) {
      throw new CFError('ACCOUNT_NOT_FOUND');
    }

    const code = getVerificationCode();
    const token = generateResetPasswortToken({
      id: userId,
      email: userEmail,
    });

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
      throw new CFError('ACCOUNT_NOT_FOUND');
    }

    const data = await this.collection.findOne({
      _id: userId,
      passwordResetCode: code,
    });

    return data?.email === email;
  }

  public async resetPassword(input: ResetPasswordInput): Promise<TokenizedAccount> {
    const { id, email, password, confirmPassword } = input;

    if (password !== confirmPassword) {
      throw new CFError('INVALID_USER_INPUT');
    }
    validatePasswordInput(password);

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

    const token = generateToken({
      id: account._id,
      email: account.email,
    });
    const document = toAccountObject(account);

    return {
      token,
      ...document,
    };
  }
}

export { AccountProvider };
