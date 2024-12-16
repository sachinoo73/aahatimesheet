import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../config/db.js';

describe('Database Connection', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should connect to the database successfully', async () => {
    await connectDB();
    const dbState = mongoose.connection.readyState;
    expect(dbState).toBe(1); // 1 means connected
  });

  it('should handle connection errors gracefully', async () => {
    process.env.MONGODB_URI = 'invalid-uri';
    await expect(connectDB()).rejects.toThrow();
  });
});
