const jwt = require('jsonwebtoken');
const { ApiError } = require('./errorHandler');
const { logger } = require('../utils/logger');

/**
 * Authentication middleware to protect routes
 */
const authenticate = (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError('Authentication required', 401);
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      throw new ApiError('Authentication required', 401);
    }
    
    // Verify token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      logger.error('JWT verification failed:', error);
      throw new ApiError('Invalid or expired token', 401);
    }
  } catch (error) {
    next(error);
  }
};

module.exports = { authenticate }; 