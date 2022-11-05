import { Document } from 'mongodb';

import { Profile } from '../../src/application/providers/types/profiles.provider.types';

interface ProfileDocument extends Document, Omit<Profile, 'id' | 'password'> {}

const toProfileObject = (profile: ProfileDocument): Profile => {
  return {
    id: profile._id.toHexString(),
    email: profile.email,
    password: profile.password,
    firstName: profile.firstName,
    lastName: profile.lastName,
    gender: profile.gender,
    isActive: profile.isActive,
    dateOfBirth: profile.dateOfBirth,
  };
};

export { ProfileDocument, toProfileObject };
