import { MongoClient } from 'mongodb';

import config from '../config.integration';
import { Institutes, institutes } from './initial-data';

const uri = config.MONGO_CONNECTION_STRING ?? '';
const dbName = config.DB_NAME;

let client = new MongoClient(uri);

const seedCollection = async (collectionName: string, data: Institutes[]): Promise<void> => {
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
  } catch (err) {
    console.log(err);
  }
})();
