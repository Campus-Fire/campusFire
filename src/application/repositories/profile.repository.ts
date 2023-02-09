import { Document } from 'mongodb';
import { Profile } from '../models/profile.model';

interface ProfileDocument extends Document, Omit<Profile, 'id'> {}

const toProfileObject = (profile: ProfileDocument): Profile => {
  return {
    id: profile._id.toHexString(),
    instituteId: profile.instituteId,
    firstName: profile.firstName,
    lastName: profile.lastName,
    dateOfBirth: profile.dateOfBirth,
    gender: profile.gender,
    tagline: profile.tagline,
    about: profile.about,
    faculty: profile.faculty,
    interests: profile.interests,
    onResidence: profile.onResidence,
    mainImage: profile.mainImage,
    isActive: profile.isActive,
  };
};

export { ProfileDocument, toProfileObject };
