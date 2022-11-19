import { Document } from 'mongodb';
import { Preference } from '../application/providers/preference/preference.provider.types';

interface PreferenceDocument extends Document, Preference {}

const toPreferenceObject = (preference: PreferenceDocument): Preference => {
  return {
    userId: preference.userId,
    gender: preference.gender,
    usersEncountered: preference.usersEncountered,
    liked: preference.liked,
    likedBy: preference.likedBy,
    disliked: preference.disliked,
  };
};

export { PreferenceDocument, toPreferenceObject };
