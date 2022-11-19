import { UserInputError } from 'apollo-server';
import { Collection, ObjectId } from 'mongodb';
import { ProfileDocument, toProfileObject } from '../../../entities/profile.entity';
import validateStringInputs from '../../../helpers/string-validator';
import { validateEmailInput, validateNameInput } from '../../../helpers/validator';
import { accountProvider, instituteProvider, preferenceProvider } from '../../indexes/provider';
import { CreateProfileInput, Profile, UpdateProfileInput } from './profile.provider.types';

class ProfileProvider {
  constructor(private collection: Collection<ProfileDocument>) {}

  public async getProfile(id: any): Promise<Profile> {
    const userId = new ObjectId(id);

    const profileCount = await this.collection.countDocuments({ _id: userId });
    if (profileCount === 0) {
      throw new Error('User not found!');
    }

    const preferredGender = await preferenceProvider.getUserPreferredGender(userId);
    const profilesData = await this.collection.find({ gender: preferredGender }).toArray();
    const profiles = profilesData.map(toProfileObject);

    for (let profile of profiles) {
      if (!(await preferenceProvider.isUserEncounteredBefore(userId, new ObjectId(profile.id)))) {
        return profile;
      }
    }

    throw new Error('No profiles can be found for user');
  }

  public async createProfile(input: CreateProfileInput): Promise<Profile> {
    const { id, email, firstName, lastName, gender, dateOfBirth, preferredGender } = input;
    const userId = new ObjectId(id);

    const profileCount = await this.collection.countDocuments({ _id: userId });
    if (profileCount > 0) {
      throw new Error('Please try to update the profile later');
    }

    if (!id || !email || !firstName || !lastName || !gender || !dateOfBirth || !preferredGender) {
      throw new UserInputError('Incomplete information provided to create a profile');
    }
    validateEmailInput(email);
    validateNameInput(firstName);
    validateNameInput(lastName);
    validateNameInput(gender);
    validateStringInputs(dateOfBirth);
    validateNameInput(preferredGender);

    if (!(await accountProvider.isAccountVerified(userId))) {
      throw new Error('Please verify account before creating a profile');
    }
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

    if (!id) {
      throw new UserInputError('Incomplete information provided to update a profile');
    }
    if (firstName) validateStringInputs(firstName);
    if (lastName) validateStringInputs(lastName);
    if (dateOfBirth) validateStringInputs(dateOfBirth);
    if (gender) validateStringInputs(gender);
    if (!(await accountProvider.isAccountVerified(userId))) {
      throw new Error('Please verify account before updating profile');
    }

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

  public async isUserActive(id: ObjectId): Promise<boolean> {
    const profileData = await this.collection.findOne({ _id: id });
    if (!profileData) {
      throw new Error('User not found!');
    }

    return profileData.isActive;
  }
}

export { ProfileProvider };
