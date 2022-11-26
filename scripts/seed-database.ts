import { MongoClient } from 'mongodb';

import config from '../config';
import {
  Accounts,
  accounts,
  Institutes,
  institutes,
  Preferences,
  preferences,
  Profiles,
  profiles,
} from './initial-data';

const uri = config.MONGO_CONNECTION_STRING ?? '';
const dbName = config.DB_NAME;

let client = new MongoClient(uri);

const seedCollection = async (
  collectionName: string,
  data: Preferences[] | Profiles[] | Institutes[] | Accounts[]
): Promise<void> => {
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
    await seedCollection('profiles', profiles);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await seedCollection('preferences', preferences);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await seedCollection('institutes', institutes);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await seedCollection('accounts', accounts);
  } catch (err) {
    console.log(err);
  }
})();
