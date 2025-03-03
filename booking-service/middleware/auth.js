const { ApiError } = require('./errorHandler');
const { logger } = require('../utils/logger');
const axios = require('axios');
const { setAuthToken } = require('../config/supabase');

/**
 * Authentication middleware to protect routes
 * This middleware verifies the JWT token by calling the User Service
 */
const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new ApiError('No token provided', 401);
    }

    // Verify token with user service
    const response = await axios.get(`${process.env.USER_SERVICE_URL}/api/users/verify-token`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.data?.data?.user) {
      throw new ApiError('Invalid token', 401);
    }

    // Set the auth token for Supabase
    setAuthToken(token);

    // Set user data in request
    req.user = response.data.data.user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    next(new ApiError(error.response?.data?.message || 'Authentication failed', 401));
  }
};

module.exports = auth; 