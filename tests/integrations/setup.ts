import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import { beforeAll, afterAll, afterEach } from '@jest/globals';
import app from '../../src/app';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // Create an in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = await mongoServer.getUri();
  
  // Connect to the in-memory database
  await mongoose.connect(mongoUri, {
    // Add mongoose connection options
    // useNewUrlParser: true,
    // useUnifiedTopology: true
  } as ConnectOptions);
});

afterAll(async () => {
  // Disconnect and stop MongoDB instance
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

afterEach(async () => {
  // Clean up the database after each test
  if (mongoose.connection.readyState !== 0) {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
  }
});

export { app };