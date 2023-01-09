import { ObjectID } from 'bson';

import deterministicId from '../src/helpers/deterministic-id';

interface Institutes {
  _id: ObjectID;
  name: string;
  emailExt: string;
  city: string;
  province: string;
  country: string;
}

const UniID = {
  EXAMPLE: deterministicId('@example.com'),
  UCalgary: deterministicId('@ucalgary.ca'),
  SAIT: deterministicId('@edu.sait.ca'),
};

const institutes: Institutes[] = [
  {
    _id: UniID.EXAMPLE,
    name: 'Example University',
    emailExt: 'example.com',
    city: 'Calgary',
    province: 'AB',
    country: 'Canada',
  },
  {
    _id: UniID.UCalgary,
    name: 'University of Calgary',
    emailExt: 'ucalgary.ca',
    city: 'Calgary',
    province: 'AB',
    country: 'Canada',
  },
];

export { Institutes, institutes };
