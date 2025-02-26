import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Generate admin token (for initial setup only)
router.post('/admin-token', async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if user is admin
    if (!user.isAdmin) {
      return res.status(401).json({ message: 'User is not an admin' });
    }
    
    // Generate token for admin
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Return user data with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Check if password matches
    // For existing plain text passwords, do a direct comparison
    // For hashed passwords, use the matchPassword method
    let isMatch = false;
    
    if (user.password === password) {
      // Direct comparison for plain text passwords
      isMatch = true;
    } else {
      // Use bcrypt comparison for hashed passwords
      try {
        isMatch = await user.matchPassword(password);
      } catch (error) {
        // If matchPassword fails (e.g., password not hashed), isMatch remains false
        console.error('Password comparison error:', error);
      }
    }
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Return user data with token
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      hourlyRate: user.hourlyRate,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, hourlyRate, username } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      username: username || null, // Set username if provided, otherwise null
      hourlyRate: hourlyRate || 20
    });
    
    if (user) {
      // Return user data with token
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        hourlyRate: user.hourlyRate,
        token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
