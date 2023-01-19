import bcrypt from 'bcryptjs';
import { addYears } from 'date-fns';
import { MongoClient, ObjectId } from 'mongodb';
import config from '../config';
import deterministicId from '../src/helpers/deterministic-id';
import { institutes } from './initial-data';
import { faker } from '@faker-js/faker';

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
    let images: any[] = [];

    for (let i = 0; i < 20; i++) {
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
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const dateOfBirth = faker.date.birthdate({
        min: 18,
        max: 65,
        mode: 'age',
      });
      const gender = ['MALE', 'FEMALE'];
      const tagline = 'a testing tagline for profiles';
      const about = faker.lorem.lines();
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
        mainImage: 'https://res.cloudinary.com/dt0duopxa/image/upload/v1673306657/nch1vc87xky825jt623j.jpg',
        isActive: true,
      });

      images.push({
        _id: new ObjectId(),
        userId: id,
        src: 'https://res.cloudinary.com/dt0duopxa/image/upload/v1673306657/nch1vc87xky825jt623j.jpg',
        isPrimary: true,
        addedAt: faker.date.recent(),
      });

      images.push({
        _id: new ObjectId(),
        userId: id,
        src: 'https://res.cloudinary.com/dt0duopxa/image/upload/v1672475847/test/logo2_egbxgh.png',
        isPrimary: false,
        addedAt: faker.date.recent(),
      });
    }

    await seedCollection('accounts', accounts);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await seedCollection('profiles', profiles);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await seedCollection('images', images);
    await new Promise((resolve) => setTimeout(resolve, 1000));
  } catch (err) {
    console.log(err);
  }
})();
