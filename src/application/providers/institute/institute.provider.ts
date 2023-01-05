import { ApolloError } from 'apollo-server-express';
import { Collection, ObjectId } from 'mongodb';
import { InstituteDocument, toInstituteObject } from '../../../entities/institute.entity';
import { Institute } from './institute.provider.types';

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
      throw new ApolloError('Invalid Email. Ensure it is valid University/College email');
    }
  }

  public async getInstituteId(email: string): Promise<ObjectId> {
    const emailParts = email.split('@');

    const data = await this.collection.findOne({ emailExt: emailParts[1] });
    if (!data) {
      throw new ApolloError('Invalid Email. Ensure it is University/College email');
    }

    return data._id;
  }
}

export { InstituteProvider };
