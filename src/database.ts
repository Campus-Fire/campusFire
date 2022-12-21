import { Db, Document, MongoClient } from 'mongodb';

import config from '../config';

const setupDb = (): Db => {
  const uri = config.MONGO_CONNECTION_STRING;
  const dbName = config.DB_NAME;

  console.log(`MongoDB is connecting to ${uri}`);
  const client = new MongoClient(uri);

  try {
    client.connect(() => {
      console.log(`MongoDb connected to ${dbName}`);
    });

    return client.db(dbName);
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export { Document, setupDb };
