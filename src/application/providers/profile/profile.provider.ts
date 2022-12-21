import { UserInputError } from 'apollo-server';
import { Collection, ObjectId } from 'mongodb';

import { ProfileDocument, toProfileObject } from '../../../entities/profile.entity';
import { validateEmailInput, validateNameInput, validateStringInputs } from '../../../helpers/validator';
import { accountProvider, instituteProvider } from '../../indexes/provider';
import { CreateProfileInput, Profile } from './profile.provider.types';

class ProfileProvider {
  constructor(private collection: Collection<ProfileDocument>) { }

  public async getAllProfiles(id: any): Promise<Profile[]> {
    const userId = new ObjectId(id);
    const profilesData = await this.collection
      .find({
        _id: { $ne: userId },
      })
      .toArray();

    return profilesData.map(toProfileObject);
  }

  public async createProfile(input: CreateProfileInput): Promise<Profile> {
    const { id, email, firstName, lastName, dateOfBirth, gender, tagline, about, interests, faculty, onResidence } =
      input;
    const userId = new ObjectId(id);

    const profileCount = await this.collection.countDocuments({ _id: userId });
    if (profileCount > 0) {
      throw new Error('Can not create a duplicate profile');
    }

    if (!firstName || !lastName || !dateOfBirth || !gender || !tagline || !about || !interests || !faculty) {
      throw new UserInputError('Incomplete information provided to create a profile');
    }
    validateEmailInput(email);
    validateNameInput(firstName);
    validateNameInput(lastName);
    validateStringInputs(dateOfBirth);
    validateStringInputs(tagline);
    validateStringInputs(about);

    if (!(await accountProvider.isAccountVerified(userId))) {
      throw new Error('Please verify account before creating a profile');
    }
    const instituteId = await instituteProvider.getInstituteId(email);
    const dBirth = new Date(dateOfBirth);

    const profileData = await this.collection.insertOne({
      _id: userId,
      instituteId,
      firstName,
      lastName,
      dateOfBirth: dBirth,
      gender,
      tagline,
      about,
      interests,
      faculty,
      onResidence,
      isActive: true,
    });

    const profile = await this.collection.findOne({ _id: profileData.insertedId });
    if (!profile) {
      throw new Error(`Could not create ${firstName} ${lastName} user`);
    }

    return toProfileObject(profile);
  }

  /*
  public async updateProfile(input: UpdateProfileInput): Promise<Profile> {
    const { id, firstName, lastName, dateOfBirth, gender, tagline, about, faculty, isActive } = input;
    if (!id) {
      throw new UserInputError('Incomplete information provided to update a profile');
    }
    if (firstName) validateStringInputs(firstName);
    if (lastName) validateStringInputs(lastName);
    if (dateOfBirth) validateStringInputs(dateOfBirth);
    if (gender) validateStringInputs(gender);
    if (tagline) validateStringInputs(tagline);
    if (about) validateStringInputs(about);
    if (faculty) validateStringInputs(faculty);

    const userId = new ObjectId(id);
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
          ...(tagline && { tagline: tagline }),
          ...(about && { about: about }),
          ...(faculty && { faculty: faculty }),
          ...(isActive && { isActive: isActive }),
        },
      },
      { returnDocument: 'after' }
    );

    const profile = data.value;
    if (!profile) {
      throw new Error(`Profile with id - ${id}, does not exist`);
    }

    return toProfileObject(profile);
  }
  */

  public async isUserActive(id: ObjectId): Promise<boolean> {
    const profileData = await this.collection.findOne({ _id: id });
    if (!profileData) {
      throw new Error('User not found!');
    }

    return profileData.isActive;
  }
}

export { ProfileProvider };
