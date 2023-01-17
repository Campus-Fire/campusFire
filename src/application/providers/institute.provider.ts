import { Collection, ObjectId } from 'mongodb';
import { InstituteDocument, toInstituteObject } from '../repositories/institute.repository';
import { Institute } from '../models/institute.model';
import { CFError } from '../../lib/errors-handler';

class InstituteProvider {
  constructor(private collection: Collection<InstituteDocument>) {}

  public async getInstitutes(): Promise<Institute[]> {
    const institutes = await this.collection.find().toArray();

    return institutes.map(toInstituteObject);
  }

  public async isValidEmailExtension(email: string): Promise<void> {
    const emailParts = email.split('@');

    const data = await this.collection.findOne({
      emailExt: emailParts[1],
    });
    if (!data) {
      throw new CFError('INVALID_EMAIL');
    }
  }

  public async getInstituteId(email: string): Promise<ObjectId> {
    const emailParts = email.split('@');

    const data = await this.collection.findOne({
      emailExt: emailParts[1],
    });
    if (!data) {
      throw new CFError('INVALID_EMAIL');
    }

    return data._id;
  }
}

export { InstituteProvider };
