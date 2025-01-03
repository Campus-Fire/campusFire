import { Collection, ObjectId } from 'mongodb';
import { validateEmailInput, validateNameInput, validateStringInputs } from '../../helpers/validator';
import { CFError } from '../../lib/errors-handler';
import { accountProvider, instituteProvider } from '../indexes/providers.index';
import { CreateProfileInput, Profile, UpdateProfileInput } from '../models/profile.model';
import { ProfileDocument, toProfileObject } from '../repositories/profile.repository';

class ProfileProvider {
  constructor(private collection: Collection<ProfileDocument>) {}

  public async getProfile(id: string): Promise<Profile> {
    const userId = new ObjectId(id);
    const profileData = await this.collection.findOne({
      _id: userId,
    });
    if (!profileData) {
      throw new CFError('PROFILE_NOT_FOUND');
    }

    const profile = toProfileObject(profileData);

    return {
      ...profile,
    };
  }

  public async getAllProfiles(id: string): Promise<Profile[]> {
    const userId = new ObjectId(id);

    const profilesData = await this.collection.find({ _id: { $ne: userId }, isActive: true }).toArray();

    return profilesData.map(toProfileObject);
  }

  public async createProfile(input: CreateProfileInput): Promise<Profile> {
    const { id, email, firstName, lastName, dateOfBirth, gender, tagline, about, interests, faculty, onResidence } =
      input;
    const userId = new ObjectId(id);

    const profileCount = await this.collection.countDocuments({
      _id: userId,
    });
    if (profileCount > 0) {
      throw new CFError('PROFILE_ALREADY_EXISTS');
    }

    if (!firstName || !lastName || !dateOfBirth || !gender || !tagline || !about || !interests || !faculty) {
      throw new CFError('INVALID_USER_INPUT');
    }
    validateEmailInput(email);
    validateNameInput(firstName);
    validateNameInput(lastName);
    validateStringInputs(dateOfBirth);
    validateStringInputs(tagline);
    validateStringInputs(about);

    if (!(await accountProvider.isAccountVerified(userId))) {
      throw new CFError('ACCOUNT_UNVERIFIED');
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
      isActive: false,
    });

    const profile = await this.collection.findOne({ _id: profileData.insertedId });
    if (!profile) {
      throw new Error(`Could not create ${firstName} ${lastName} user`);
    }

    return toProfileObject(profile);
  }

  public async setProfileActive(userId: ObjectId): Promise<void> {
    const usrId = new ObjectId(userId);
    const profileData = await this.collection.findOneAndUpdate(
      { _id: usrId },
      { $set: { ...{ isActive: true } } },
      { returnDocument: 'after' }
    );
    if (!profileData.value) {
      throw new CFError('PROFILE_NOT_FOUND');
    }
  }

  public async updateProfile(input: UpdateProfileInput): Promise<Profile> {
    const { id, firstName, lastName, dateOfBirth, gender, tagline, about, faculty, interests, onResidence } = input;
    if (!id) {
      throw new Error('Incomplete information provided to update a profile');
    }
    if (firstName) validateStringInputs(firstName);
    if (lastName) validateStringInputs(lastName);
    if (dateOfBirth) validateStringInputs(dateOfBirth);
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
          ...(interests && { interests: interests }),
          ...(onResidence && { onResidence: onResidence }),
        },
      },
      { returnDocument: 'after' }
    );

    const profile = data.value;
    if (!profile) {
      throw new Error(`Profile with id - ${id}, does not exist`);
    }

    console.log(profile);

    return toProfileObject(profile);
  }

  public async isUserActive(id: ObjectId): Promise<boolean> {
    const profileData = await this.collection.findOne({ _id: id });
    if (!profileData) {
      throw new CFError('PROFILE_NOT_FOUND');
    }

    return profileData.isActive;
  }

  public async setProfileInactive(userId: ObjectId): Promise<void> {
    const usrId = new ObjectId(userId);
    const profileData = await this.collection.findOneAndUpdate(
      { _id: usrId },
      { $set: { ...{ isActive: false } } },
      { returnDocument: 'after' }
    );
    if (!profileData.value) {
      throw new CFError('PROFILE_NOT_FOUND');
    }
  }
  // public async setMainImage(usrId: ObjectId, imgId: ObjectId): Promise<void> {
  //   const profileData = await this.collection.findOneAndUpdate(
  //     { _id: usrId },
  //     { $set: { ...{ mainImage: imgId } } },
  //     { returnDocument: 'after' }
  //   );
  //   if (!profileData.value) {
  //     throw new CFError('PROFILE_NOT_FOUND');
  //   }
  // }
}

export { ProfileProvider };
