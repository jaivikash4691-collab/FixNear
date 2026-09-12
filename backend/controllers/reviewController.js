import Review from '../models/Review.js';
import ServiceRequest from '../models/ServiceRequest.js';
import MechanicProfile from '../models/MechanicProfile.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { emitToUser } from '../services/socketService.js';

/**
 * @desc    Submit a review and rating for a completed service
 * @route   POST /api/reviews
 * @access  Private (CUSTOMER only)
 */
export const createReview = async (req, res, next) => {
  try {
    const { serviceRequestId, rating, comment } = req.body;

    if (!serviceRequestId || !rating || !comment) {
      return sendError(res, 'Service request ID, rating (1-5), and review text are required', 400);
    }

    if (rating < 1 || rating > 5) {
      return sendError(res, 'Rating must be between 1 and 5 stars', 400);
    }

    // Verify service request exists and is COMPLETED
    const serviceRequest = await ServiceRequest.findOne({
      _id: serviceRequestId,
      customer: req.user._id,
    });

    if (!serviceRequest) {
      return sendError(res, 'Service request not found or does not belong to you', 404);
    }

    if (serviceRequest.status !== 'COMPLETED') {
      return sendError(res, 'Reviews can only be submitted for completed services', 400);
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ serviceRequest: serviceRequestId });
    if (existingReview) {
      return sendError(res, 'You have already reviewed this service', 400);
    }

    const review = await Review.create({
      serviceRequest: serviceRequestId,
      customer: req.user._id,
      mechanic: serviceRequest.mechanic,
      rating: Number(rating),
      comment,
    });

    serviceRequest.ratingGiven = true;
    await serviceRequest.save();

    // Fetch mechanic to notify
    const mechanic = await MechanicProfile.findById(serviceRequest.mechanic);
    if (mechanic && mechanic.user) {
      await Notification.create({
        recipient: mechanic.user,
        sender: req.user._id,
        type: 'NEW_REVIEW',
        title: 'New Customer Review! ⭐',
        message: `${req.user.name} rated your service ${rating} stars: "${comment.slice(0, 80)}${comment.length > 80 ? '...' : ''}"`,
        data: {
          serviceRequestId: serviceRequest._id,
          reviewId: review._id,
        },
      });

      emitToUser(mechanic.user, 'new_review', {
        reviewId: review._id,
        rating: review.rating,
        comment: review.comment,
        customerName: req.user.name,
      });
    }

    return sendSuccess(res, 'Review submitted successfully', { review }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all reviews for a mechanic
 * @route   GET /api/reviews/mechanic/:mechanicId
 * @access  Public
 */
export const getMechanicReviews = async (req, res, next) => {
  try {
    const { mechanicId } = req.params;
    const reviews = await Review.find({ mechanic: mechanicId })
      .populate('customer', 'name avatar')
      .sort('-createdAt');

    return sendSuccess(res, 'Reviews retrieved', { reviews });
  } catch (error) {
    next(error);
  }
};
