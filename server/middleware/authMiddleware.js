import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to protect routes
export const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
      req.user = await User.findById(decoded.id).select('-password');
      next();
      return; // Exit after calling next()
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized' });
    }
  }
  
  // Only reach here if no token was found in the authorization header
  return res.status(401).json({ message: 'Not authorized, no token' });
};

// Admin middleware
export const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};
