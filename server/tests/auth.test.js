import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import User from '../models/User.js';

describe('Authentication Endpoints', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await mongoose.connect(process.env.MONGODB_URI);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/users/register', () => {
    const validUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      hourlyRate: 25
    };

    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send(validUser);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe(validUser.email);
      expect(response.body.name).toBe(validUser.name);
      expect(response.body.hourlyRate).toBe(validUser.hourlyRate);
    });

    it('should not register a user with existing email', async () => {
      await User.create(validUser);

      const response = await request(app)
        .post('/api/users/register')
        .send(validUser);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('User already exists');
    });

    it('should not register a user with invalid data', async () => {
      const invalidUser = {
        name: 'Test User',
        email: 'invalid-email',
        password: '123'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(invalidUser);

      expect(response.status).toBe(500);
    });
  });

  describe('POST /api/users/login', () => {
    const user = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      hourlyRate: 25
    };

    beforeEach(async () => {
      await request(app)
        .post('/api/users/register')
        .send(user);
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: user.email,
          password: user.password
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body.email).toBe(user.email);
    });

    it('should not login with incorrect password', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: user.email,
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });

    it('should not login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'nonexistent@example.com',
          password: user.password
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});
