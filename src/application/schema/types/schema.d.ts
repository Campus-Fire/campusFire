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
  Date: Date;
  ObjectID: any;
};

export type AcceptConversationRequestInput = {
  conversationId: Scalars['ObjectID'];
};

export type Account = {
  __typename?: 'Account';
  createdAt: Scalars['Date'];
  email: Scalars['String'];
  expiresAt: Scalars['Date'];
  id: Scalars['ObjectID'];
  isVerified: Scalars['Boolean'];
  lastLogin?: Maybe<Scalars['Date']>;
  token?: Maybe<Scalars['String']>;
};

export type Conversation = {
  __typename?: 'Conversation';
  acceptingParticipant: ConversationParticipant;
  id: Scalars['ObjectID'];
  isConversationRequest: Scalars['Boolean'];
  latestMessage: Message;
  startingParticipant: ConversationParticipant;
  updatedAt: Scalars['Date'];
};

export type ConversationParticipant = {
  __typename?: 'ConversationParticipant';
  createdAt: Scalars['Date'];
  hasSeenLatestMessage: Scalars['Boolean'];
  id: Scalars['ObjectID'];
  userId: Scalars['ObjectID'];
};

export type CreateProfileInput = {
  about: Scalars['String'];
  dateOfBirth: Scalars['String'];
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
  addedAt: Scalars['Date'];
  id: Scalars['ObjectID'];
  isPrimary: Scalars['Boolean'];
  src: Scalars['String'];
  userId: Scalars['ObjectID'];
};

export type ImageInput = {
  imgId: Scalars['ObjectID'];
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

export type Message = {
  __typename?: 'Message';
  body: Scalars['String'];
  conversationId: Scalars['ObjectID'];
  createdAt: Scalars['Date'];
  id: Scalars['ObjectID'];
  senderId: Scalars['ObjectID'];
};

export type Mutation = {
  __typename?: 'Mutation';
  acceptConversationRequest: Scalars['Boolean'];
  createProfile: Profile;
  forgotPasswordRequest: Scalars['String'];
  login: Account;
  readConversation: Scalars['Boolean'];
  registerAccount: Account;
  resendVerificationCode: Scalars['Boolean'];
  resetPassword: Account;
  sendConversationRequest: Scalars['String'];
  sendMessage: Scalars['Boolean'];
  setPrimaryImage: Scalars['String'];
  uploadMultipleImages: Array<Scalars['String']>;
  uploadSingleImage: Scalars['String'];
  verifyAccountPasswordReset: Scalars['Boolean'];
  verifyAccountRegistration: Scalars['Boolean'];
};

export type MutationAcceptConversationRequestArgs = {
  input: AcceptConversationRequestInput;
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

export type MutationReadConversationArgs = {
  input: ReadConversationInput;
};

export type MutationRegisterAccountArgs = {
  input: RegisterAccountInput;
};

export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};

export type MutationSendConversationRequestArgs = {
  input: SendConversationRequestInput;
};

export type MutationSendMessageArgs = {
  input: SendMessageInput;
};

export type MutationSetPrimaryImageArgs = {
  input: ImageInput;
};

export type MutationUploadMultipleImagesArgs = {
  input: UploadMultpleImagesInput;
};

export type MutationUploadSingleImageArgs = {
  input: UploadSingleImageInput;
};

export type MutationVerifyAccountPasswordResetArgs = {
  input: VerificationCodeInput;
};

export type MutationVerifyAccountRegistrationArgs = {
  input: VerificationCodeInput;
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
  mainImage?: Maybe<Image>;
  onResidence: Scalars['Boolean'];
  otherImages?: Maybe<Array<Maybe<Image>>>;
  tagline: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  accounts: Array<Account>;
  availableProfiles: Array<Profile>;
  conversationMessages?: Maybe<Array<Message>>;
  getConversationRequests?: Maybe<Array<Conversation>>;
  getUserProfile: Profile;
  institutes: Array<Institute>;
  privacyPolicy: Scalars['String'];
  refreshToken: Account;
  termsOfUse: Scalars['String'];
  userConversations?: Maybe<Array<Conversation>>;
};

export type QueryConversationMessagesArgs = {
  conversationId: Scalars['ObjectID'];
};

export type QueryGetUserProfileArgs = {
  id: Scalars['String'];
};

export type QueryRefreshTokenArgs = {
  token: Scalars['String'];
};

export type ReadConversationInput = {
  conversationId: Scalars['ObjectID'];
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

export type SendConversationRequestInput = {
  participantId: Scalars['ObjectID'];
  requestMessage: Scalars['String'];
};

export type SendMessageInput = {
  body: Scalars['String'];
  conversationId: Scalars['ObjectID'];
};

export type Subscription = {
  __typename?: 'Subscription';
  conversationUpdated?: Maybe<Conversation>;
  messageSent?: Maybe<Message>;
};

export type SubscriptionMessageSentArgs = {
  conversationId: Scalars['String'];
};

export type UploadMultpleImagesInput = {
  imgSources: Array<Scalars['String']>;
};

export type UploadSingleImageInput = {
  imgSrc: Scalars['String'];
};

export type VerificationCodeInput = {
  code: Scalars['String'];
};
