import { ObjectId } from 'mongodb';

import { Gender } from '../../../application/schema/types/schema';

interface Preference {
  id: ObjectId;
  gender: Gender;
}

export { Preference };
