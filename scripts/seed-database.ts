import { MongoClient } from 'mongodb';

import { Preferences, preferences, profiles, Profiles, Institutes, institutes } from './initial-data';

require('dotenv').config();

const uri = process.env.MONGO_CONNECTION_STRING ?? '';
const dbName = process.env.DB_NAME;

let client = new MongoClient(uri);

const seedCollection = async (
  collectionName: string,
  data: Preferences[] | Profiles[] | Institutes[]
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
  } catch (err) {
    console.log(err);
  }
})();
