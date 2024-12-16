import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import User from '../models/User.js';

describe('Admin Operations', () => {
  let mongoServer;
  let adminToken;
  let regularUserToken;

  const adminUser = {
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin123',
    isAdmin: true,
    hourlyRate: 30
  };

  const regularUser = {
    name: 'Regular User',
    email: 'user@test.com',
    password: 'user123',
    hourlyRate: 25
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await mongoose.connect(process.env.MONGODB_URI);

    // Create admin user
    const adminResponse = await request(app)
      .post('/api/users/register')
      .send(adminUser);
    adminToken = adminResponse.body.token;

    // Create regular user
    const userResponse = await request(app)
      .post('/api/users/register')
      .send(regularUser);
    regularUserToken = userResponse.body.token;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear any additional test data
    await User.deleteMany({ 
      email: { 
        $nin: [adminUser.email, regularUser.email] 
      } 
    });
  });

  describe('GET /api/admin/users', () => {
    beforeEach(async () => {
      // Create additional test users
      await User.create([
        {
          name: 'Test User 1',
          email: 'test1@example.com',
          password: 'password123',
          hourlyRate: 20
        },
        {
          name: 'Test User 2',
          email: 'test2@example.com',
          password: 'password123',
          hourlyRate: 22
        }
      ]);
    });

    it('should allow admin to retrieve all users', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(4); // admin + regular + 2 test users
      
      // Verify user data structure
      const user = response.body[0];
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('isAdmin');
      expect(user).toHaveProperty('hourlyRate');
      expect(user).not.toHaveProperty('password'); // Password should not be included
    });

    it('should not allow regular users to access admin endpoints', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${regularUserToken}`);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Not authorized as admin');
    });

    it('should not allow access without authentication', async () => {
      const response = await request(app)
        .get('/api/admin/users');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should handle invalid authentication token', async () => {
      const response = await request(app)
        .get('/api/admin/users')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Not authorized');
    });
  });

  describe('Admin User Management', () => {
    it('should verify admin status is preserved', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: adminUser.email,
          password: adminUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.isAdmin).toBe(true);
    });

    it('should verify regular user status', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: regularUser.email,
          password: regularUser.password
        });

      expect(response.status).toBe(200);
      expect(response.body.isAdmin).toBe(false);
    });
  });
});
