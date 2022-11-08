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
  email: Scalars['String'];
  id: Scalars['ObjectID'];
  isVerified: Scalars['Boolean'];
  password: Scalars['String'];
};

export type CreateAccountInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type CreateProfileInput = {
  dateOfBirth: Scalars['String'];
  firstName: Scalars['String'];
  gender: Scalars['String'];
  id: Scalars['ObjectID'];
  lastName: Scalars['String'];
  preferredGender: Scalars['String'];
};

export type Institute = {
  __typename?: 'Institute';
  emailExt: Scalars['String'];
  id: Scalars['ObjectID'];
  name: Scalars['String'];
  userIds?: Maybe<Array<Maybe<Scalars['ObjectID']>>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: Account;
  createProfile: Profile;
  updateProfile: Profile;
};

export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};

export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};

export type MutationUpdateProfileArgs = {
  input: UpdateProfileInput;
};

export type Preference = {
  __typename?: 'Preference';
  gender: Scalars['String'];
  likes?: Maybe<Array<Maybe<Scalars['ObjectID']>>>;
  userId: Scalars['ObjectID'];
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

export type Query = {
  __typename?: 'Query';
  accounts: Array<Account>;
  institutes: Array<Institute>;
  preference: Array<Preference>;
  profiles: Array<Profile>;
};

export type UpdateProfileInput = {
  dateOfBirth?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Scalars['String']>;
  id: Scalars['ObjectID'];
  isActive?: InputMaybe<Scalars['Boolean']>;
  lastName?: InputMaybe<Scalars['String']>;
};
