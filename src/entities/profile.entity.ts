import { Document } from 'mongodb';

import { Profile } from '../application/providers/profile/profile.provider.types';

interface ProfileDocument extends Document, Omit<Profile, 'id'> {}

const toProfileObject = (profile: ProfileDocument): Profile => {
  return {
    id: profile._id.toHexString(),
    firstName: profile.firstName,
    lastName: profile.lastName,
    gender: profile.gender,
    isActive: profile.isActive,
    dateOfBirth: profile.dateOfBirth,
  };
};

export { ProfileDocument, toProfileObject };
