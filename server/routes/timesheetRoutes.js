import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';

const router = express.Router();

// Create timesheet entry
router.post('/', protect, async (req, res) => {
  try {
    const { date, location, startTime, endTime } = req.body;
    
    // Calculate hours worked
    const start = new Date(`${date}T${startTime}`);
    const end = new Date(`${date}T${endTime}`);
    const hoursWorked = (end - start) / (1000 * 60 * 60);
    
    const newEntry = {
      date,
      location,
      startTime,
      endTime,
      hoursWorked
    };
    
    // Find user and add timesheet entry
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.timesheets.push(newEntry);
    await user.save();
    
    // Return the newly added entry with its _id
    const addedEntry = user.timesheets[user.timesheets.length - 1];
    
    res.status(201).json(addedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all timesheet entries for a user
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.timesheets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
