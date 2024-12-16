import { rest } from 'msw';

export const handlers = [
  // Login handler
  rest.post('/api/users/login', (req, res, ctx) => {
    const { email, password } = req.body;

    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          _id: 'test-user-id',
          name: 'Test User',
          email: 'test@example.com',
          isAdmin: false,
          hourlyRate: 25,
          token: 'fake-jwt-token'
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({ message: 'Invalid email or password' })
    );
  }),

  // Register handler
  rest.post('/api/users/register', (req, res, ctx) => {
    const { email } = req.body;

    if (email === 'existing@example.com') {
      return res(
        ctx.status(400),
        ctx.json({ message: 'User already exists' })
      );
    }

    return res(
      ctx.status(201),
      ctx.json({
        _id: 'new-user-id',
        name: req.body.name,
        email: req.body.email,
        isAdmin: false,
        hourlyRate: req.body.hourlyRate,
        token: 'fake-jwt-token'
      })
    );
  }),

  // Timesheet handlers
  rest.post('/api/timesheet', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        ...req.body,
        hoursWorked: 8
      })
    );
  }),

  rest.get('/api/timesheet', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json([
        {
          date: '2024-03-15',
          location: 'Office',
          startTime: '09:00',
          endTime: '17:00',
          hoursWorked: 8
        }
      ])
    );
  }),

  // Admin handlers
  rest.get('/api/admin/users', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.includes('fake-admin-token')) {
      return res(
        ctx.status(401),
        ctx.json({ message: 'Not authorized as admin' })
      );
    }

    return res(
      ctx.status(200),
      ctx.json([
        {
          _id: 'user-1',
          name: 'User One',
          email: 'user1@example.com',
          isAdmin: false,
          hourlyRate: 25
        },
        {
          _id: 'user-2',
          name: 'User Two',
          email: 'user2@example.com',
          isAdmin: false,
          hourlyRate: 30
        }
      ])
    );
  })
];
