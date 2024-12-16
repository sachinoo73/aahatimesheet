import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connectDB from './config/db.js';
import User from './models/User.js';

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Middleware to protect routes
const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, 'your_jwt_secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  }
  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Auth routes
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        hourlyRate: user.hourlyRate,
        token: jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '30d' })
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/users/register', async (req, res) => {
  try {
    const { name, email, password, hourlyRate } = req.body;
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }
    
    const user = await User.create({
      name,
      email,
      password,
      hourlyRate
    });
    
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      hourlyRate: user.hourlyRate,
      token: jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '30d' })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Timesheet routes
app.post('/api/timesheet', protect, async (req, res) => {
  try {
    const { date, location, startTime, endTime } = req.body;
    const user = await User.findById(req.user._id);
    
    // Calculate hours worked
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const hoursWorked = (end - start) / (1000 * 60 * 60);
    
    user.timesheets.push({
      date,
      location,
      startTime,
      endTime,
      hoursWorked
    });
    
    await user.save();
    res.status(201).json(user.timesheets[user.timesheets.length - 1]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/timesheet', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.timesheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin routes
app.get('/api/admin/users', protect, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      res.status(401).json({ message: 'Not authorized as admin' });
      return;
    }
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
