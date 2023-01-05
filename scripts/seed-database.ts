import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

import deterministicId from '../src/helpers/deterministic-id';
import config from '../config';
import { institutes } from './initial-data';
import { addYears } from 'date-fns';

const uri = config.MONGO_CONNECTION_STRING ?? '';
const dbName = config.DB_NAME;

let client = new MongoClient(uri);

const seedCollection = async (collectionName: string, data: any[]): Promise<void> => {
  try {
    console.log(`MongoDB is connecting to ${uri}`);

    client = await client.connect();

    const collection = client.db(dbName).collection(collectionName);

    console.log(`Destroying ${collectionName}...`);

    if (await collection.countDocuments()) {
      await collection.drop();
    }

    console.log(`Seeding ${collectionName}...`);
    await collection.insertMany(data);

    console.log(`Done seeding ${collectionName}.`);

    client.close();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

(async (): Promise<void> => {
  try {
    await seedCollection('institutes', institutes);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let accounts: any[] = [];
    let profiles: any[] = [];

    for (let i = 0; i < 300; i++) {
      const email = `test.user${i}@example.com`;
      const password = 'test';

      const id = deterministicId(email);
      const hashedPassword = await bcrypt.hash(password, 12);
      const createAt = new Date();
      const expAt = addYears(new Date(), 4);

      accounts.push({
        _id: id,
        email: email,
        password: hashedPassword,
        createdAt: createAt,
        expiresAt: expAt,
        isVerified: true,
      });

      const instId = deterministicId('@example.com');
      const firstName = 'test';
      const lastName = 'user';
      const dateOfBirth = new Date();
      const gender = ['MALE', 'FEMALE'];
      const tagline = 'a testing tagline for profiles';
      const about = 'about the user, includes normal details in brief';
      const interests = ['CODING', 'HIKING'];
      const faculty = 'SCHULICH_SCHOOL_OF_ENGINEERING';

      const gen = gender[i % 2];

      profiles.push({
        _id: id,
        instituteId: instId,
        firstName,
        lastName,
        dateOfBirth,
        gender: gen,
        tagline,
        about,
        interests,
        faculty,
        onResidence: true,
        isActive: true,
      });
    }

    await seedCollection('accounts', accounts);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await seedCollection('profiles', profiles);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    console.log(err);
  }
})();
