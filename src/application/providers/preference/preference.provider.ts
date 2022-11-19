import { UserInputError } from 'apollo-server';
import { Collection, ObjectId } from 'mongodb';

import { PreferenceDocument, toPreferenceObject } from '../../../entities/preference.entity';
import { profileProvider } from '../../indexes/provider';
import { Preference, ProfileInteractionInput } from './preference.provider.types';

class PreferenceProvider {
  constructor(private collection: Collection<PreferenceDocument>) { }

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

  public async getUserPreferredGender(userId: ObjectId): Promise<string> {
    const data = await this.collection.findOne({ userId });
    if (!data) {
      throw new Error('Could not find gender preferrences for user');
    }

    return data.gender;
  }

  public async isUserEncounteredBefore(userId: ObjectId, encounterId: ObjectId): Promise<boolean> {
    const data = await this.collection.findOne({ userId, usersEncountered: encounterId });
    if (data) {
      return true;
    }

    await this.collection.updateOne(
      { userId },
      {
        $push: { usersEncountered: encounterId },
      }
    );

    return false;
  }

  public async likeUserProfile(input: ProfileInteractionInput): Promise<Preference> {
    const { id, profileId } = input;

    const userId = new ObjectId(id);
    if (!(await profileProvider.isUserActive(userId))) {
      throw new UserInputError('Inactive user');
    }

    const profileUserId = new ObjectId(profileId);
    if (!(await profileProvider.isUserActive(profileUserId))) {
      throw new UserInputError('Inactive user');
    }

    await this.collection.updateOne(
      { userId },
      {
        $push: { liked: profileUserId },
      }
    );

    await this.collection.updateOne(
      { userId: profileUserId },
      {
        $push: { likedBy: userId },
      }
    );

    const preferenceData = await this.collection.findOne({ userId });
    if (!preferenceData) {
      throw new Error('Could not like the profile');
    }

    return toPreferenceObject(preferenceData);
  }

  public async dislikeUserProfile(input: ProfileInteractionInput): Promise<Preference> {
    const { id, profileId } = input;

    const userId = new ObjectId(id);
    if (!(await profileProvider.isUserActive(userId))) {
      throw new UserInputError('Inactive user');
    }

    const profileUserId = new ObjectId(profileId);
    if (!(await profileProvider.isUserActive(profileUserId))) {
      throw new UserInputError('Inactive user');
    }

    await this.collection.updateOne(
      { userId },
      {
        $push: { disliked: profileUserId },
      }
    );

    const preferenceData = await this.collection.findOne({ userId });
    if (!preferenceData) {
      throw new Error('Could not dislike the profile');
    }

    return toPreferenceObject(preferenceData);
  }

  public async areUsersMatched(userA: ObjectId, userB: ObjectId): Promise<void> {
    const match = await this.collection.findOne({
      userId: userA,
      liked: userB,
      likedBy: userB,
    });
    if (!match) {
      throw new Error('Users are not matched with each other');
    }
  }
}

export { PreferenceProvider };
