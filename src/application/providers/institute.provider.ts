import { Collection } from 'mongodb';

import { InstituteDocument, toInstituteObject } from '../../../src/entities/institute.entity';
import { Institute } from './types/institute.provider.types';

class InstituteProvider {
  constructor(private collection: Collection<InstituteDocument>) {}

  public async getInstitutes(): Promise<Institute[]> {
    const institutes = await this.collection.find().toArray();

    return institutes.map(toInstituteObject);
  }

  public async isValidEmailExtension(email: string): Promise<void> {
    const emailParts = email.split('@');

    const data = await this.collection.findOne({ emailExt: emailParts[1] });

    if (!data) {
      throw new Error('Not a valid email. Please use University/College email');
    }
    /*
        const instituteData = await this.collection.updateOne(
          { _id: data._id },
          {
            $push: { userIds: userId },
          }
        );
    
        if (!instituteData) {
          throw new Error('Could not update Institute while creating user');
        }
        */
  }
}

export { InstituteProvider };
