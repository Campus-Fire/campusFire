import { Document } from 'mongodb';

import { Preference } from '../application/providers/preference/preference.provider.types';

interface PreferenceDocument extends Document, Omit<Preference, 'id'> {}

const toPreferenceObject = (preference: PreferenceDocument): Preference => {
  return {
    id: preference._id.toHexString(),
    gender: preference.gender,
  };
};

export { PreferenceDocument, toPreferenceObject };
