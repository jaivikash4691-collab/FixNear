import MechanicProfile from '../models/MechanicProfile.js';
import ServiceRequest from '../models/ServiceRequest.js';
import Vehicle from '../models/Vehicle.js';
import Favorite from '../models/Favorite.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Get mechanic workshop dashboard KPIs, charts & revenue statistics
 * @route   GET /api/mechanics/stats/overview
 * @access  Private (MECHANIC only)
 */
export const getMechanicStats = async (req, res, next) => {
  try {
    const mechanicProfile = await MechanicProfile.findOne({ user: req.user._id });
    if (!mechanicProfile) {
      return sendError(res, 'Mechanic profile not found', 404);
    }

    const mechId = mechanicProfile._id;

    // Start of today
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      todayRequestsCount,
      pendingRequestsCount,
      activeRepairsCount,
      completedCount,
      totalCount,
      recentRequests,
      revenueAggregation,
      distinctCustomers,
      statusBreakdown,
    ] = await Promise.all([
      ServiceRequest.countDocuments({
        mechanic: mechId,
        createdAt: { $gte: startOfToday },
      }),
      ServiceRequest.countDocuments({
        mechanic: mechId,
        status: 'REQUESTED',
      }),
      ServiceRequest.countDocuments({
        mechanic: mechId,
        status: { $in: ['ACCEPTED', 'DIAGNOSING', 'REPAIRING', 'READY'] },
      }),
      ServiceRequest.countDocuments({
        mechanic: mechId,
        status: 'COMPLETED',
      }),
      ServiceRequest.countDocuments({
        mechanic: mechId,
      }),
      ServiceRequest.find({ mechanic: mechId })
        .populate('customer', 'name avatar email phone')
        .populate('vehicle')
        .sort('-createdAt')
        .limit(6),
      ServiceRequest.aggregate([
        { $match: { mechanic: mechId, status: 'COMPLETED' } },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: { $ifNull: ['$finalCost', '$estimatedCost'] } },
          },
        },
      ]),
      ServiceRequest.distinct('customer', { mechanic: mechId }),
      ServiceRequest.aggregate([
        { $match: { mechanic: mechId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const totalRevenue =
      revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    return sendSuccess(res, 'Mechanic statistics retrieved', {
      kpis: {
        todayRequests: todayRequestsCount,
        pendingRequests: pendingRequestsCount,
        activeRepairs: activeRepairsCount,
        completedServices: completedCount,
        totalServices: totalCount,
        totalRevenue,
        customerCount: distinctCustomers.length,
        averageRating: mechanicProfile.averageRating,
        reviewCount: mechanicProfile.reviewCount,
      },
      statusBreakdown,
      recentRequests,
      profile: mechanicProfile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get customer dashboard metrics & active repair status
 * @route   GET /api/users/customer/stats
 * @access  Private (CUSTOMER only)
 */
export const getCustomerStats = async (req, res, next) => {
  try {
    const customerId = req.user._id;

    const [
      activeRepairsCount,
      vehiclesCount,
      completedServicesCount,
      savedMechanicsCount,
      activeRequest,
      recentServices,
    ] = await Promise.all([
      ServiceRequest.countDocuments({
        customer: customerId,
        status: { $in: ['REQUESTED', 'ACCEPTED', 'DIAGNOSING', 'REPAIRING', 'READY'] },
      }),
      Vehicle.countDocuments({ owner: customerId }),
      ServiceRequest.countDocuments({ customer: customerId, status: 'COMPLETED' }),
      Favorite.countDocuments({ customer: customerId }),
      ServiceRequest.findOne({
        customer: customerId,
        status: { $in: ['REQUESTED', 'ACCEPTED', 'DIAGNOSING', 'REPAIRING', 'READY'] },
      })
        .populate('mechanic')
        .populate('vehicle')
        .sort('-updatedAt'),
      ServiceRequest.find({ customer: customerId })
        .populate('mechanic')
        .populate('vehicle')
        .sort('-createdAt')
        .limit(5),
    ]);

    return sendSuccess(res, 'Customer dashboard statistics retrieved', {
      kpis: {
        activeRepairs: activeRepairsCount,
        vehiclesCount,
        completedServices: completedServicesCount,
        savedMechanicsCount,
      },
      activeRequest,
      recentServices,
    });
  } catch (error) {
    next(error);
  }
};
