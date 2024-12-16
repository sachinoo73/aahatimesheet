import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../server.js';
import User from '../models/User.js';

describe('Timesheet Operations', () => {
  let mongoServer;
  let token;
  let userId;

  const testUser = {
    name: 'Test User',
    email: 'timesheet@test.com',
    password: 'password123',
    hourlyRate: 25
  };

  const validTimesheet = {
    date: '2024-03-15',
    location: 'Office',
    startTime: '09:00',
    endTime: '17:00'
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGODB_URI = mongoServer.getUri();
    await mongoose.connect(process.env.MONGODB_URI);

    // Create a test user and get token
    const response = await request(app)
      .post('/api/users/register')
      .send(testUser);
    
    token = response.body.token;
    userId = response.body._id;
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    // Clear timesheet entries before each test
    const user = await User.findById(userId);
    if (user) {
      user.timesheets = [];
      await user.save();
    }
  });

  describe('POST /api/timesheet', () => {
    it('should create a new timesheet entry successfully', async () => {
      const response = await request(app)
        .post('/api/timesheet')
        .set('Authorization', `Bearer ${token}`)
        .send(validTimesheet);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('date', validTimesheet.date);
      expect(response.body).toHaveProperty('location', validTimesheet.location);
      expect(response.body).toHaveProperty('startTime', validTimesheet.startTime);
      expect(response.body).toHaveProperty('endTime', validTimesheet.endTime);
      expect(response.body).toHaveProperty('hoursWorked');
    });

    it('should calculate hours worked correctly', async () => {
      const response = await request(app)
        .post('/api/timesheet')
        .set('Authorization', `Bearer ${token}`)
        .send(validTimesheet);

      // 8 hours between 09:00 and 17:00
      expect(response.body.hoursWorked).toBe(8);
    });

    it('should not create timesheet entry without authentication', async () => {
      const response = await request(app)
        .post('/api/timesheet')
        .send(validTimesheet);

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should validate required fields', async () => {
      const invalidTimesheet = {
        date: '2024-03-15',
        // missing location
        startTime: '09:00',
        // missing endTime
      };

      const response = await request(app)
        .post('/api/timesheet')
        .set('Authorization', `Bearer ${token}`)
        .send(invalidTimesheet);

      expect(response.status).toBe(500);
    });
  });

  describe('GET /api/timesheet', () => {
    beforeEach(async () => {
      // Add some test timesheet entries
      await request(app)
        .post('/api/timesheet')
        .set('Authorization', `Bearer ${token}`)
        .send(validTimesheet);

      await request(app)
        .post('/api/timesheet')
        .set('Authorization', `Bearer ${token}`)
        .send({
          ...validTimesheet,
          date: '2024-03-16'
        });
    });

    it('should retrieve all timesheet entries for the user', async () => {
      const response = await request(app)
        .get('/api/timesheet')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('date');
      expect(response.body[0]).toHaveProperty('hoursWorked');
    });

    it('should not retrieve timesheets without authentication', async () => {
      const response = await request(app)
        .get('/api/timesheet');

      expect(response.status).toBe(401);
      expect(response.body.message).toBe('Not authorized, no token');
    });

    it('should return empty array when user has no timesheets', async () => {
      // Clear all timesheets first
      const user = await User.findById(userId);
      user.timesheets = [];
      await user.save();

      const response = await request(app)
        .get('/api/timesheet')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });
  });
});
