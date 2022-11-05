import { Collection } from 'mongodb';

import { ProfileDocument, toProfileObject } from '../../../src/entities/profile.entity';
import { Profile } from './types/profiles.provider.types';

class ProfileProvider {
  constructor(private collection: Collection<ProfileDocument>) {}

  public async getProfiles(): Promise<Profile[]> {
    const profiles = await this.collection.find().toArray();

    return profiles.map(toProfileObject);
  }
}

export { ProfileProvider };
