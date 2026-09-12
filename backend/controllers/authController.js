import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import MechanicProfile from '../models/MechanicProfile.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

// Helper to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fixnear_secret_key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * @desc    Register a new user (CUSTOMER or MECHANIC)
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role = 'CUSTOMER',
      phone,
      address,
      city,
      latitude,
      longitude,
      // Mechanic specific fields
      businessName,
      description,
      experienceYears,
      emergencyService,
      vehicleTypesSupported,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'An account with this email already exists', 400);
    }

    // Set coordinates
    const coordinates =
      longitude && latitude ? [parseFloat(longitude), parseFloat(latitude)] : [77.5946, 12.9716];

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
      phone: phone || '',
      address: address || '',
      city: city || '',
      location: {
        type: 'Point',
        coordinates,
      },
    });

    let mechanicProfile = null;

    // If role is MECHANIC, automatically initialize MechanicProfile
    if (role === 'MECHANIC') {
      mechanicProfile = await MechanicProfile.create({
        user: user._id,
        businessName: businessName || `${name}'s Garage`,
        description: description || 'Professional automotive repair and maintenance service.',
        phone: phone || 'N/A',
        address: address || 'Main Service Road',
        city: city || 'Bangalore',
        location: {
          type: 'Point',
          coordinates,
        },
        experienceYears: experienceYears ? parseInt(experienceYears) : 5,
        emergencyService: Boolean(emergencyService),
        vehicleTypesSupported: vehicleTypesSupported || ['Car', 'Bike', 'SUV'],
        verificationStatus: 'VERIFIED',
      });
    }

    const token = generateToken(user._id);

    return sendSuccess(
      res,
      'Registration successful',
      {
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          avatar: user.avatar,
          address: user.address,
          city: user.city,
          location: user.location,
        },
        mechanicProfile,
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Login user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return sendError(res, 'Please provide email and password', 400);
    }

    // Check for user (include password for verification)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid email or password', 401);
    }

    // Optional role check if requested
    if (role && user.role !== role) {
      return sendError(
        res,
        `Account exists, but it is registered as a ${user.role}. Please select the correct login option.`,
        403
      );
    }

    let mechanicProfile = null;
    if (user.role === 'MECHANIC') {
      mechanicProfile = await MechanicProfile.findOne({ user: user._id });
    }

    const token = generateToken(user._id);

    return sendSuccess(res, 'Logged in successfully', {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        address: user.address,
        city: user.city,
        location: user.location,
      },
      mechanicProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current authenticated user info
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let mechanicProfile = null;
    if (user.role === 'MECHANIC') {
      mechanicProfile = await MechanicProfile.findOne({ user: user._id });
    }

    return sendSuccess(res, 'User profile retrieved', {
      user,
      mechanicProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, city, avatar, latitude, longitude } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return sendError(res, 'User not found', 404);
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (city !== undefined) user.city = city;
    if (avatar !== undefined) user.avatar = avatar;

    if (longitude && latitude) {
      user.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    await user.save();

    let mechanicProfile = null;
    if (user.role === 'MECHANIC') {
      mechanicProfile = await MechanicProfile.findOne({ user: user._id });
      if (mechanicProfile && (phone || address || city || (longitude && latitude))) {
        if (phone) mechanicProfile.phone = phone;
        if (address) mechanicProfile.address = address;
        if (city) mechanicProfile.city = city;
        if (longitude && latitude) {
          mechanicProfile.location = {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          };
        }
        await mechanicProfile.save();
      }
    }

    return sendSuccess(res, 'Profile updated successfully', {
      user,
      mechanicProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Change password
 * @route   PUT /api/auth/change-password
 * @access  Private
 */
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return sendError(res, 'Please provide current and new password', 400);
    }

    if (newPassword.length < 6) {
      return sendError(res, 'New password must be at least 6 characters', 400);
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return sendError(res, 'Incorrect current password', 400);
    }

    user.password = newPassword;
    await user.save();

    return sendSuccess(res, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};
