import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Get all users (admin only)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password -timesheets');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create admin user (admin only)
router.post('/users/admin', protect, admin, async (req, res) => {
  try {
    const { name, email, password, hourlyRate, username } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new admin user
    const user = await User.create({
      name,
      email,
      password,
      username: username || null, // Set username if provided, otherwise null
      hourlyRate: hourlyRate || 30, // Default higher rate for admins
      isAdmin: true // Set as admin
    });
    
    if (user) {
      // Return user data without password
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        hourlyRate: user.hourlyRate,
        createdAt: user.createdAt
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
