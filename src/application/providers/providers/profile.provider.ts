import { Collection, ObjectId } from 'mongodb';

import { validateEmailInput, validateNameInput } from '../../../../src/application/helpers/validator.helper';
import { ProfileDocument, toProfileObject } from '../../../../src/entities/profile.entity';
import validateStringInputs from '../../../../src/lib/string-validator';
import { instituteProvider, preferenceProvider } from '../index';
import { CreateProfileInput, Profile, UpdateProfileInput } from '../types/profile.provider.types';

class ProfileProvider {
  constructor(private collection: Collection<ProfileDocument>) {}

  public async getProfiles(): Promise<Profile[]> {
    const profiles = await this.collection.find().toArray();

    return profiles.map(toProfileObject);
  }

  public async createProfile(input: CreateProfileInput): Promise<Profile> {
    const { id, email, firstName, lastName, gender, dateOfBirth, preferredGender } = input;
    const userId = new ObjectId(id);

    if (email) validateEmailInput(email);
    if (firstName) validateNameInput(firstName);
    if (lastName) validateNameInput(lastName);
    if (gender) validateNameInput(gender);
    if (dateOfBirth) validateStringInputs(dateOfBirth);
    if (preferredGender) validateNameInput(preferredGender);

    await preferenceProvider.createUserPreference(userId, preferredGender);
    await instituteProvider.addToInstitute(userId, email);

    const data = await this.collection.insertOne({
      _id: userId,
      firstName,
      lastName,
      dateOfBirth,
      gender,
      isActive: true,
    });

    const profile = await this.collection.findOne({ _id: data.insertedId });
    if (!profile) {
      throw new Error(`Could not create ${firstName} ${lastName} user`);
    }

    return toProfileObject(profile);
  }

  public async updateProfile(input: UpdateProfileInput): Promise<Profile> {
    const { id, firstName, lastName, dateOfBirth, gender } = input;

    const userId = new ObjectId(id);

    if (firstName) validateStringInputs(firstName);
    if (lastName) validateStringInputs(lastName);
    if (dateOfBirth) validateStringInputs(dateOfBirth);
    if (gender) validateStringInputs(gender);

    const data = await this.collection.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          ...(firstName && { firstName: firstName }),
          ...(lastName && { lastName: lastName }),
          ...(dateOfBirth && { dateOfBirth: dateOfBirth }),
          ...(gender && { gender: gender }),
        },
      },
      { returnDocument: 'after' }
    );

    const profile = data.value;
    if (!profile) {
      throw new Error(`User with id ${id} does not exist`);
    }

    return toProfileObject(profile);
  }
}

export { ProfileProvider };
