import { Collection } from 'mongodb';

import validateStringInputs from '../../../src/lib/string-validator';
import { ProfileDocument, toProfileObject } from '../../../src/entities/profile.entity';
import { CreateProfileInput, Profile } from './types/profile.provider.types';
import deterministicId from '../../../src/lib/deterministic-id';
import { preferenceProvider } from '.';

class ProfileProvider {
  constructor(private collection: Collection<ProfileDocument>) {}

  public async getProfiles(): Promise<Profile[]> {
    const profiles = await this.collection.find().toArray();

    return profiles.map(toProfileObject);
  }

  public async createProfile(input: CreateProfileInput): Promise<Profile> {
    const { email, password, firstName, lastName, dateOfBirth, gender, preferredGender } = input;
    const id = deterministicId(email);

    if (preferredGender) {
      validateStringInputs(preferredGender);
      await preferenceProvider.createUserPreference(id, preferredGender);
    }

    if (email) {
      validateStringInputs(email);
      await this.userWithEmailExists(email);
    }

    if (password) validateStringInputs(password);
    if (firstName) validateStringInputs(firstName);
    if (lastName) validateStringInputs(lastName);
    if (dateOfBirth) validateStringInputs(dateOfBirth);
    if (gender) validateStringInputs(gender);

    const data = await this.collection.insertOne({
      _id: id,
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      dateOfBirth: dateOfBirth,
      gender: gender,
      isActive: true,
    });

    const profile = await this.collection.findOne({ _id: data.insertedId });

    if (!profile) {
      throw new Error(`Could not create ${firstName} ${lastName} user`);
    }

    return toProfileObject(profile);
  }

  private async userWithEmailExists(email: string): Promise<void> {
    const data = await this.collection.countDocuments({ email: email });

    if (data && data > 0) {
      throw new Error(`User with ${email} already exists`);
    }
  }
}

export { ProfileProvider };
