import { ObjectId, ObjectID } from 'bson';
import { createHash } from 'crypto';

export interface UserDetails {
  _id: ObjectID;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  isActive: boolean;
}

export interface Preferences {
  userId: ObjectID;
  gender: string;
  likes?: ObjectID[];
}

const deterministicId = (data: string): ObjectId => {
  const hash = createHash('sha1').update(data).digest('hex').slice(0, 24);

  return new ObjectId(hash);
};

const ID = {
  JohnSmith: deterministicId('John Smith'),
  MikeWilliams: deterministicId('Mike Williams'),
  KimGarcia: deterministicId('Kim Garcia'),
  MaryMartinez: deterministicId('Mary Martinez'),
  JackJones: deterministicId('Jack Jones'),
};

export const userDetails: UserDetails[] = [
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

export const preferences: Preferences[] = [
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
