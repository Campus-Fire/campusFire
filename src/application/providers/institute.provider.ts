import { Collection, ObjectId } from 'mongodb';

import { InstituteDocument } from '../../../src/entities/institute.entity';

class InstituteProvider {
  constructor(private collection: Collection<InstituteDocument>) { }

  public async isValidEmailExtension(userId: ObjectId, email: string): Promise<void> {
    const emailParts = email.split('@');

    console.log(emailParts);

    const data = await this.collection.findOne({ emailExt: emailParts[1] });

    if (!data) {
      throw new Error('Not a valid email. Please use University/College email');
    }

    const instituteData = await this.collection.updateOne(
      { _id: data._id },
      {
        $push: { userIds: email },
      }
    );

    if (!instituteData) {
      throw new Error('Could not update Institute while creating user');
    }
  }
}

export { InstituteProvider };
