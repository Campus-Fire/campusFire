import { Collection } from 'mongodb';

import { PreferenceDocument, toPreferenceObject } from '../../../src/entities/preference.entity';
import { Preference } from './types/preference.provider.types';

class PreferenceProvider {
  constructor(private collection: Collection<PreferenceDocument>) {}

  public async getAllPreferences(): Promise<Preference[]> {
    const preference = await this.collection.find().toArray();

    return preference.map(toPreferenceObject);
  }
}

export { PreferenceProvider };
