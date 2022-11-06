import { ObjectID } from 'bson';

import deterministicId from '../src/lib/deterministic-id';

interface Profiles {
  _id: ObjectID;
  email: string;
  password: string;
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

const ID = {
  JohnSmith: deterministicId('john.smith@example.com'),
  MikeWilliams: deterministicId('mike.williams@example.com'),
  KimGarcia: deterministicId('kim.garcia@example.com'),
  MaryMartinez: deterministicId('mary.martinez@example.com'),
  JackJones: deterministicId('jack.jones@example.com'),
};

const profiles: Profiles[] = [
  {
    _id: ID.JohnSmith,
    email: 'john.smith@example.com',
    password: 'johnsmith',
    firstName: 'John',
    lastName: 'Smith',
    dateOfBirth: new Date().toISOString(),
    gender: 'M',
    isActive: true,
  },
  {
    _id: ID.MikeWilliams,
    email: 'mike.williams@example.com',
    password: 'mikewilliams',
    firstName: 'Mike',
    lastName: 'Williams',
    dateOfBirth: new Date().toISOString(),
    gender: 'M',
    isActive: true,
  },
  {
    _id: ID.KimGarcia,
    email: 'kim.garcia@example.com',
    password: 'kimgarcia',
    firstName: 'Kim',
    lastName: 'Garcia',
    dateOfBirth: new Date().toISOString(),
    gender: 'F',
    isActive: true,
  },
  {
    _id: ID.MaryMartinez,
    email: 'mary.martinez@example.com',
    password: 'marymartinez',

    firstName: 'Mary',
    lastName: 'Martinez',
    dateOfBirth: new Date().toISOString(),
    gender: 'F',
    isActive: true,
  },
  {
    _id: ID.JackJones,
    email: 'jack.jones@example.com',
    password: 'jackjones',
    firstName: 'Jack',
    lastName: 'Jones',
    dateOfBirth: new Date().toISOString(),
    gender: 'M',
    isActive: true,
  },
];

const preferences: Preferences[] = [
  {
    userId: ID.JohnSmith,
    gender: 'F',
    likes: [ID.KimGarcia],
  },
  {
    userId: ID.MikeWilliams,
    gender: 'B',
    likes: [ID.JackJones, ID.KimGarcia],
  },
  {
    userId: ID.KimGarcia,
    gender: 'M',
    likes: [ID.MikeWilliams],
  },
  {
    userId: ID.MaryMartinez,
    gender: 'M',
  },
  {
    userId: ID.JackJones,
    gender: 'M',
  },
];

export { Profiles, Preferences, profiles, preferences };
