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
  Date: any;
  DateTime: any;
  ObjectID: any;
};

export type Account = {
  __typename?: 'Account';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ObjectID'];
  isVerified: Scalars['Boolean'];
  lastLogin?: Maybe<Scalars['DateTime']>;
  token?: Maybe<Scalars['String']>;
};

export type CreateProfileInput = {
  about: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  faculty: Faculty;
  firstName: Scalars['String'];
  gender: Gender;
  interests: Array<Interest>;
  lastName: Scalars['String'];
  onResidence: Scalars['Boolean'];
  tagline: Scalars['String'];
};

export enum Faculty {
  CummingSchoolOfMedicine = 'CUMMING_SCHOOL_OF_MEDICINE',
  FacultyOfArts = 'FACULTY_OF_ARTS',
  FacultyOfKinesiology = 'FACULTY_OF_KINESIOLOGY',
  FacultyOfLaw = 'FACULTY_OF_LAW',
  FacultyOfNursing = 'FACULTY_OF_NURSING',
  FacultyOfScience = 'FACULTY_OF_SCIENCE',
  FacultyOfSocialWork = 'FACULTY_OF_SOCIAL_WORK',
  FacultyOfVeterinaryMedicine = 'FACULTY_OF_VETERINARY_MEDICINE',
  HaskayneSchoolOfBusiness = 'HASKAYNE_SCHOOL_OF_BUSINESS',
  SchoolOfArchitecturePlanningAndLandscape = 'SCHOOL_OF_ARCHITECTURE_PLANNING_AND_LANDSCAPE',
  SchulichSchoolOfEngineering = 'SCHULICH_SCHOOL_OF_ENGINEERING',
  WerklundSchoolOfEducation = 'WERKLUND_SCHOOL_OF_EDUCATION',
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE',
  Other = 'OTHER',
}

export type Image = {
  __typename?: 'Image';
  id: Scalars['ObjectID'];
  src: Scalars['String'];
};

export type Institute = {
  __typename?: 'Institute';
  city: Scalars['String'];
  country: Scalars['String'];
  emailExt: Scalars['String'];
  id: Scalars['ObjectID'];
  name: Scalars['String'];
  province: Scalars['String'];
};

export enum Interest {
  Art = 'ART',
  Coding = 'CODING',
  Cooking = 'COOKING',
  Dancing = 'DANCING',
  Exercise = 'EXERCISE',
  Football = 'FOOTBALL',
  Gardening = 'GARDENING',
  Gym = 'GYM',
  Hiking = 'HIKING',
  Hockey = 'HOCKEY',
  Indi = 'INDI',
  Movies = 'MOVIES',
  Music = 'MUSIC',
  Netflix = 'NETFLIX',
  Outdoors = 'OUTDOORS',
  Pets = 'PETS',
  Photography = 'PHOTOGRAPHY',
  Politics = 'POLITICS',
  Pop = 'POP',
  Rap = 'RAP',
  Rock = 'ROCK',
  Running = 'RUNNING',
  Skiing = 'SKIING',
  Soccer = 'SOCCER',
  Sports = 'SPORTS',
  Studying = 'STUDYING',
  Theatre = 'THEATRE',
  Travelling = 'TRAVELLING',
  Trekking = 'TREKKING',
}

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createProfile: Profile;
  forgotPasswordRequest: Scalars['String'];
  login: Account;
  registerAccount: Account;
  resendVerificationCode: Scalars['Boolean'];
  resetPassword: Account;
  uploadImage: Scalars['String'];
  verifyAccountPasswordReset: Scalars['Boolean'];
  verifyAccountRegistration: Scalars['Boolean'];
};

export type MutationCreateProfileArgs = {
  input: CreateProfileInput;
};

export type MutationForgotPasswordRequestArgs = {
  input: ResetPasswordRequestInput;
};

export type MutationLoginArgs = {
  input: LoginInput;
};

export type MutationRegisterAccountArgs = {
  input: RegisterAccountInput;
};

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};

export type MutationUploadImageArgs = {
  input: UploadImageInput;
};

export type MutationVerifyAccountPasswordResetArgs = {
  input: VerificationCodeInput;
};

export type MutationVerifyAccountRegistrationArgs = {
  input: VerificationCodeInput;
};

export type Preference = {
  __typename?: 'Preference';
  gender: Gender;
  id: Scalars['ObjectID'];
};

export type Profile = {
  __typename?: 'Profile';
  about: Scalars['String'];
  dateOfBirth: Scalars['Date'];
  faculty: Faculty;
  firstName: Scalars['String'];
  gender: Gender;
  id: Scalars['ObjectID'];
  instituteId: Scalars['ObjectID'];
  interests: Array<Interest>;
  isActive: Scalars['Boolean'];
  lastName: Scalars['String'];
  onResidence: Scalars['Boolean'];
  tagline: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  accounts: Array<Account>;
  institutes: Array<Institute>;
  preference: Array<Preference>;
  privacyPolicy: Scalars['String'];
  profiles: Array<Profile>;
  termsOfUse: Scalars['String'];
};

export type RegisterAccountInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type ResetPasswordInput = {
  confirmPassword: Scalars['String'];
  password: Scalars['String'];
};

export type ResetPasswordRequestInput = {
  email: Scalars['String'];
};

export type UploadImageInput = {
  imgSrc: Scalars['String'];
};

export type VerificationCodeInput = {
  code: Scalars['String'];
};
