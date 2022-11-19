import { ObjectId } from 'bson';
import { createHash } from 'crypto';

const deterministicId = (data: string): ObjectId => {
  const hash = createHash('sha1').update(data).digest('hex').slice(0, 24);

  return new ObjectId(hash);
};

export default deterministicId;
