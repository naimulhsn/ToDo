const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Register a new user
 */
const signup = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validation
    if (!fullName || !email || !password) {
      logger.warn({
        message: 'Signup failed: Missing required fields',
        requestId: req.requestId,
        email,
        action_type: 'user_signup_failed'
      });
      return res.status(400).json({
        success: false,
        message: 'Full name, email, and password are required'
      });
    }

    if (password.length < 6) {
      logger.warn({
        message: 'Signup failed: Password too short',
        requestId: req.requestId,
        email,
        action_type: 'user_signup_failed'
      });
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn({
        message: 'Signup failed: User already exists',
        requestId: req.requestId,
        email,
        action_type: 'user_signup_failed'
      });
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const user = new User({ fullName, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info({
      message: 'User registered successfully',
      requestId: req.requestId,
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      action_type: 'user_signup',
      signup_method: 'email'
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error({
      message: 'Error during signup',
      requestId: req.requestId,
      action_type: 'user_signup_error',
      error: {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    });
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * Login user
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      logger.warn({
        message: 'Login failed: Missing credentials',
        requestId: req.requestId,
        action_type: 'user_login_failed'
      });
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn({
        message: 'Login failed: User not found',
        requestId: req.requestId,
        email,
        action_type: 'user_login_failed'
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      logger.warn({
        message: 'Login failed: Invalid password',
        requestId: req.requestId,
        email,
        userId: user._id,
        action_type: 'user_login_failed'
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    logger.info({
      message: 'User logged in successfully',
      requestId: req.requestId,
      userId: user._id,
      email: user.email,
      fullName: user.fullName,
      action_type: 'user_login',
      login_method: 'password'
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    logger.error({
      message: 'Error during login',
      requestId: req.requestId,
      action_type: 'user_login_error',
      error: {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    });
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * Get user profile
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    
    const user = await User.findById(userId);
    if (!user) {
      logger.warn({
        message: 'Profile fetch failed: User not found',
        requestId: req.requestId,
        userId,
        action_type: 'profile_fetch_failed'
      });
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    logger.info({
      message: 'User profile fetched',
      requestId: req.requestId,
      userId, 
      email: user.email,
      action_type: 'profile_fetched'
    });

    res.status(200).json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    logger.error({
      message: 'Error fetching profile',
      requestId: req.requestId,
      action_type: 'profile_fetch_error',
      error: {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    });
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Validate JWT token (for other services)
 */
const validateToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      logger.warn({
        message: 'Token validation failed: No token provided',
        requestId: req.requestId,
        action_type: 'token_validation_failed'
      });
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify user still exists
    const user = await User.findById(decoded.userId);
    if (!user) {
      logger.warn({
        message: 'Token validation failed: User not found',
        requestId: req.requestId,
        userId: decoded.userId,
        action_type: 'token_validation_failed'
      });
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userId: decoded.userId,
        email: decoded.email,
        fullName: user.fullName
      }
    });
  } catch (error) {
    logger.warn({
      message: 'Token validation failed: Invalid token',
      requestId: req.requestId,
      action_type: 'token_validation_failed',
      error: {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    });
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
};

/**
 * Logout (client-side token removal, but log the event)
 */
const logout = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    logger.info({
      message: 'User logged out',
      requestId: req.requestId,
      userId,
      action_type: 'user_logout'
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error({
      message: 'Error during logout',
      requestId: req.requestId,
      action_type: 'user_logout_error',
      error: {
        message: error.message,
        type: error.name,
        stack: error.stack
      }
    });
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  validateToken,
  logout
};
