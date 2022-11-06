import { Document } from 'mongodb';

import { Preference } from '../../src/application/providers/types/preference.provider.types';

interface PreferenceDocument extends Document, Preference {}

const toPreferenceObject = (preference: PreferenceDocument): Preference => {
  return {
    userId: preference.userId,
    gender: preference.gender,
    likes: preference.likes,
  };
};

export { PreferenceDocument, toPreferenceObject };
