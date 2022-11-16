export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Long: any;
  ObjectID: any;
};

export type Account = {
  __typename?: 'Account';
  createdAt: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['ObjectID'];
  isVerified: Scalars['Boolean'];
  lastLogin?: Maybe<Scalars['String']>;
  token: Scalars['String'];
};

export type CreateProfileInput = {
  dateOfBirth: Scalars['String'];
  firstName: Scalars['String'];
  gender: Scalars['String'];
  lastName: Scalars['String'];
  preferredGender: Scalars['String'];
};

export type Institute = {
  __typename?: 'Institute';
  city: Scalars['String'];
  country: Scalars['String'];
  emailExt: Scalars['String'];
  id: Scalars['ObjectID'];
  name: Scalars['String'];
  province: Scalars['String'];
  userIds?: Maybe<Array<Maybe<Scalars['ObjectID']>>>;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  at: Scalars['String'];
  from: Scalars['ObjectID'];
  text: Scalars['String'];
  to: Scalars['ObjectID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProfile: Profile;
  dislikeUserProfile: Preference;
  likeUserProfile: Preference;
  login: Account;
  receiveMessage?: Maybe<Array<Maybe<Message>>>;
  registerAccount: Account;
  sendMessage: Scalars['Boolean'];
  updateProfile: Profile;
  verifyAccount: Scalars['Boolean'];
};

export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};

export type MutationDislikeUserProfileArgs = {
  input: ProfileInteractionInput;
};

export type MutationLikeUserProfileArgs = {
  input: ProfileInteractionInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationReceiveMessageArgs = {
  input: ReceiveMessageInput;
};

export type MutationRegisterAccountArgs = {
  input: RegisterAccountInput;
};

export type MutationSendMessageArgs = {
  input: SendMessageInput;
};

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type MutationVerifyAccountArgs = {
  input: VerificationCodeInput;
};

export type Preference = {
  __typename?: 'Preference';
  disliked?: Maybe<Array<Maybe<Scalars['ObjectID']>>>;
  gender: Scalars['String'];
  liked?: Maybe<Array<Maybe<Scalars['ObjectID']>>>;
  likedBy?: Maybe<Array<Maybe<Scalars['ObjectID']>>>;
  userId: Scalars['ObjectID'];
  usersEncountered?: Maybe<Array<Maybe<Scalars['ObjectID']>>>;
};

export type Profile = {
  __typename?: 'Profile';
  dateOfBirth: Scalars['String'];
  firstName: Scalars['String'];
  gender: Scalars['String'];
  id: Scalars['ObjectID'];
  isActive: Scalars['Boolean'];
  lastName: Scalars['String'];
};

export type ProfileInteractionInput = {
  profileId: Scalars['ObjectID'];
};

export type Query = {
  __typename?: 'Query';
  accounts: Array<Account>;
  getProfile: Profile;
  institutes: Array<Institute>;
  preference: Array<Preference>;
};

export type ReceiveMessageInput = {
  oppUser: Scalars['ObjectID'];
  user: Scalars['ObjectID'];
};

export type RegisterAccountInput = {
  confirmPassword: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
};

export type SendMessageInput = {
  from: Scalars['ObjectID'];
  text: Scalars['String'];
  to: Scalars['ObjectID'];
};

export type UpdateProfileInput = {
  dateOfBirth?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  isActive?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
};

export type VerificationCodeInput = {
  code: Scalars['String'];
};
