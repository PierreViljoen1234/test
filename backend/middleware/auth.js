/**
 * Authentication Middleware
 * Handles JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Admin Middleware
 * Verifies that the user is an admin
 */
const adminMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

module.exports = {
  authMiddleware,
  adminMiddleware,
};
