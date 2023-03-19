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

    const imgSrc: string[] = [
      'https://images.unsplash.com/photo-1529665253569-6d01c0eaf7b6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1085&q=80',
      'https://images.unsplash.com/photo-1457449940276-e8deed18bfff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      'https://images.unsplash.com/photo-1497316730643-415fac54a2af?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80',
      'https://images.unsplash.com/photo-1466112928291-0903b80a9466?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1173&q=80',
      'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80',
      'https://images.pexels.com/photos/4417069/pexels-photo-4417069.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/943084/pexels-photo-943084.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4029925/pexels-photo-4029925.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1484810/pexels-photo-1484810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ];

    const taglines: string[] = [
      "Let's make our community stronger together.",
      'Discovering new opportunities in our community every day.',
      'Connecting with people who share my passions and values.',
      'Building a network of like-minded individuals.',
      'Bringing positive change to our community, one connection at a time.',
      'Making a difference by being an active member of our community.',
      'Exploring new perspectives and ideas through community engagement.',
      'Finding my place in this dynamic community.',
      'Contributing my skills and expertise to benefit our community.',
      'Creating meaningful connections and friendships in our community.',
    ];

    let accounts: any[] = [];
    let profiles: any[] = [];
    let images: any[] = [];

    for (let i = 0; i < 10; i++) {
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
      const tagline = taglines[i];
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
        isActive: true,
      });

      images.push({
        _id: new ObjectId(),
        userId: id,
        src: imgSrc[i],
        isPrimary: true,
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
