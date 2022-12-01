import { Document } from 'mongodb';

import { Profile } from '../application/providers/profile/profile.provider.types';

interface ProfileDocument extends Document, Omit<Profile, 'id'> {}

const toProfileObject = (profile: ProfileDocument): Profile => {
  return {
    id: profile._id.toHexString(),
    firstName: profile.firstName,
    lastName: profile.lastName,
    gender: profile.gender,
    dateOfBirth: profile.dateOfBirth,
    tagline: profile.tagline,
    about: profile.about,
    instituteId: profile.instituteId,
    faculty: profile.faculty,
    location: profile.location,
    isActive: profile.isActive,
  };
};

export { ProfileDocument, toProfileObject };
