import { Collection, ObjectId } from 'mongodb';

import { PreferenceDocument, toPreferenceObject } from '../../../../src/entities/preference.entity';
import { Preference } from '../types/preference.provider.types';

class PreferenceProvider {
  constructor(private collection: Collection<PreferenceDocument>) {}

  public async getAllPreferences(): Promise<Preference[]> {
    const preference = await this.collection.find().toArray();

    return preference.map(toPreferenceObject);
  }

  public async createUserPreference(userId: ObjectId, gender: string): Promise<void> {
    const data = await this.collection.insertOne({
      _id: new ObjectId(),
      userId,
      gender,
    });
    if (!data) {
      throw new Error(`Failed in setting the Preferences for ${userId}`);
    }
  }
}

export { PreferenceProvider };
