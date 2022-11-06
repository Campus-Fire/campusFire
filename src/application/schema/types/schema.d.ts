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

export type Preference = {
  __typename?: 'Preference';
  gender: Scalars['String'];
  likes?: Maybe<Array<Maybe<Scalars['ObjectID']>>>;
  userId: Scalars['ObjectID'];
};

export type Profile = {
  __typename?: 'Profile';
  dateOfBirth?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ObjectID']>;
  isActive?: Maybe<Scalars['Boolean']>;
  lastName?: Maybe<Scalars['String']>;
  password?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  preference: Array<Preference>;
  profiles?: Maybe<Array<Maybe<Profile>>>;
};
