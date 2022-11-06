import { Document } from 'mongodb';

import { Institute } from '../../src/application/providers/types/institute.provider.types';

interface InstituteDocument extends Document, Omit<Institute, 'id'> {}

const toInstituteObject = (institute: InstituteDocument): Institute => {
  return {
    id: institute._id.toHexString(),
    name: institute.name,
    emailExt: institute.emailExt,
    userIds: institute.userIds,
  };
};

export { InstituteDocument, toInstituteObject };
