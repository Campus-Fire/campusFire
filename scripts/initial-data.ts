import { ObjectID } from 'bson';

import deterministicId from '../src/application/helpers/deterministic-id';

interface Accounts {
  _id: ObjectID;
  email: string;
  password: string;
  isVerified: boolean;
  lastLogin?: string;
  createdAt: string;
}

interface Profiles {
  _id: ObjectID;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
}

interface Preferences {
  userId: ObjectID;
  gender: string;
  likes?: ObjectID[];
}

interface Institutes {
  _id: ObjectID;
  name: string;
  emailExt: string;
  city: string;
  province: string;
  country: string;
  userIds?: ObjectID[];
}

const UserID = {
  JohnSmith: deterministicId('john.smith@ucalgary.ca'),
  MikeWilliams: deterministicId('mike.williams@edu.sait.ca'),
  KimGarcia: deterministicId('kim.garcia@ucalgary.ca'),
  MaryMartinez: deterministicId('mary.martinez@edu.sait.ca'),
  JackJones: deterministicId('jack.jones@ucalgary.ca'),
};

const UniID = {
  UCalgary: deterministicId('@ucalgary.ca'),
  SAIT: deterministicId('@edu.sait.ca'),
};

const accounts: Accounts[] = [
  {
    _id: UserID.JohnSmith,
    email: 'john.smith@ucalgary.ca',
    password: 'johnsmith',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: UserID.MikeWilliams,
    email: 'mike.williams@edu.sait.ca',
    password: 'mikewilliams',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: UserID.KimGarcia,
    email: 'kim.garcia@ucalgary.ca',
    password: 'kimgarcia',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: UserID.MaryMartinez,
    email: 'mary.martinez@edu.sait.ca',
    password: 'marymartinez',
    isVerified: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: UserID.JackJones,
    email: 'jack.jones@ucalgary.ca',
    password: 'jackjones',
    isVerified: false,
    createdAt: new Date().toISOString(),
  },
];

const profiles: Profiles[] = [
  {
    _id: UserID.JohnSmith,
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date().toISOString(),
    gender: 'M',
    isActive: true,
  },
  {
    _id: UserID.MikeWilliams,
    firstName: 'Mike',
    lastName: 'Williams',
    dateOfBirth: new Date().toISOString(),
    gender: 'M',
    isActive: true,
  },
  {
    _id: UserID.KimGarcia,
    firstName: 'Kim',
    lastName: 'Garcia',
    dateOfBirth: new Date().toISOString(),
    gender: 'F',
    isActive: true,
  },
  {
    _id: UserID.MaryMartinez,
    firstName: 'Mary',
    lastName: 'Martinez',
    dateOfBirth: new Date().toISOString(),
    gender: 'F',
    isActive: true,
  },
  {
    _id: UserID.JackJones,
    firstName: 'Jack',
    lastName: 'Jones',
    dateOfBirth: new Date().toISOString(),
    gender: 'M',
    isActive: true,
  },
];

const preferences: Preferences[] = [
  {
    userId: UserID.JohnSmith,
    gender: 'F',
    likes: [UserID.KimGarcia],
  },
  {
    userId: UserID.MikeWilliams,
    gender: 'F',
    likes: [UserID.MaryMartinez],
  },
  {
    userId: UserID.KimGarcia,
    gender: 'M',
    likes: [UserID.JackJones, UserID.JohnSmith],
  },
  {
    userId: UserID.MaryMartinez,
    gender: 'M',
  },
  {
    userId: UserID.JackJones,
    gender: 'B',
  },
];

const institutes: Institutes[] = [
  {
    _id: UniID.UCalgary,
    name: 'University of Calgary',
    emailExt: 'ucalgary.ca',
    city: 'Calgary',
    province: 'Alberta',
    country: 'Canada',
    userIds: [UserID.JackJones, UserID.KimGarcia, UserID.JohnSmith],
  },
  {
    _id: UniID.SAIT,
    name: 'SAIT',
    emailExt: 'edu.sait.ca',
    city: 'Calgary',
    province: 'Alberta',
    country: 'Canada',
    userIds: [UserID.MaryMartinez, UserID.MikeWilliams],
  },
];

export { Profiles, profiles, Preferences, preferences, Institutes, institutes, Accounts, accounts };
