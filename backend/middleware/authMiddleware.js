import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import MechanicProfile from '../models/MechanicProfile.js';
import { sendError } from '../utils/responseHandler.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return sendError(res, 'Not authorized, no token provided', 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fixnear_secret_key');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return sendError(res, 'The user belonging to this token no longer exists', 401);
    }

    req.user = user;

    // If user is a mechanic, also attach their mechanic profile if available
    if (user.role === 'MECHANIC') {
      const mechanicProfile = await MechanicProfile.findOne({ user: user._id });
      req.mechanicProfile = mechanicProfile;
    }

    next();
  } catch (error) {
    console.error('Auth verification error:', error.message);
    return sendError(res, 'Not authorized, invalid or expired token', 401);
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        `User role '${req.user ? req.user.role : 'Guest'}' is not authorized to access this route`,
        403
      );
    }
    next();
  };
};
