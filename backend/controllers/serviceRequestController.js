import ServiceRequest from '../models/ServiceRequest.js';
import MechanicProfile from '../models/MechanicProfile.js';
import Vehicle from '../models/Vehicle.js';
import Notification from '../models/Notification.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { emitToUser, emitToRequestRoom } from '../services/socketService.js';

/**
 * @desc    Create a new service request
 * @route   POST /api/service-requests
 * @access  Private (CUSTOMER only)
 */
export const createServiceRequest = async (req, res, next) => {
  try {
    const {
      mechanicId,
      vehicleId,
      serviceId,
      serviceName,
      problemDescription,
      problemImage,
      preferredDate,
      preferredTime,
      estimatedCost,
    } = req.body;

    // Validate mechanic
    const mechanic = await MechanicProfile.findById(mechanicId).populate('user');
    if (!mechanic) {
      return sendError(res, 'Selected mechanic profile not found', 404);
    }

    // Validate vehicle
    const vehicle = await Vehicle.findOne({ _id: vehicleId, owner: req.user._id });
    if (!vehicle) {
      return sendError(res, 'Selected vehicle not found in your garage', 404);
    }

    if (!problemDescription || !preferredDate) {
      return sendError(res, 'Problem description and preferred date are required', 400);
    }

    const serviceRequest = await ServiceRequest.create({
      customer: req.user._id,
      mechanic: mechanic._id,
      vehicle: vehicle._id,
      service: serviceId || null,
      serviceName: serviceName || 'General Inspection / Custom Service',
      problemDescription,
      problemImage: problemImage || '',
      preferredDate,
      preferredTime: preferredTime || '09:00 AM',
      estimatedCost: estimatedCost ? Number(estimatedCost) : 0,
      status: 'REQUESTED',
      statusHistory: [
        {
          status: 'REQUESTED',
          timestamp: new Date(),
          note: 'Service request created by customer',
          updatedBy: req.user._id,
        },
      ],
    });

    // Create Notification for Mechanic
    const mechanicUserId = mechanic.user._id || mechanic.user;
    await Notification.create({
      recipient: mechanicUserId,
      sender: req.user._id,
      type: 'NEW_REQUEST',
      title: 'New Service Request',
      message: `${req.user.name} requested service for ${vehicle.brand} ${vehicle.model} (${serviceRequest.serviceName}).`,
      data: {
        serviceRequestId: serviceRequest._id,
        mechanicId: mechanic._id,
        vehicleId: vehicle._id,
      },
    });

    // Real-time socket notification to Mechanic
    emitToUser(mechanicUserId, 'new_service_request', {
      requestId: serviceRequest._id,
      customerName: req.user.name,
      vehicle: `${vehicle.brand} ${vehicle.model}`,
      serviceName: serviceRequest.serviceName,
      preferredDate,
    });

    const populatedRequest = await ServiceRequest.findById(serviceRequest._id)
      .populate('customer', 'name email phone avatar')
      .populate('vehicle')
      .populate('mechanic');

    return sendSuccess(
      res,
      'Service request created successfully',
      { serviceRequest: populatedRequest },
      201
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get customer's service requests
 * @route   GET /api/service-requests/customer
 * @access  Private (CUSTOMER only)
 */
export const getCustomerRequests = async (req, res, next) => {
  try {
    const { status, type } = req.query;
    const query = { customer: req.user._id };

    if (status) {
      query.status = status;
    } else if (type === 'active') {
      query.status = { $in: ['REQUESTED', 'ACCEPTED', 'DIAGNOSING', 'REPAIRING', 'READY'] };
    } else if (type === 'history') {
      query.status = { $in: ['COMPLETED', 'REJECTED', 'CANCELLED'] };
    }

    const requests = await ServiceRequest.find(query)
      .populate('mechanic')
      .populate('vehicle')
      .sort('-createdAt');

    return sendSuccess(res, 'Customer service requests retrieved', { requests });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get mechanic workshop's incoming & active service requests
 * @route   GET /api/service-requests/mechanic
 * @access  Private (MECHANIC only)
 */
export const getMechanicRequests = async (req, res, next) => {
  try {
    const mechanicProfile = await MechanicProfile.findOne({ user: req.user._id });
    if (!mechanicProfile) {
      return sendError(res, 'Mechanic profile not found', 404);
    }

    const { status, tab } = req.query;
    const query = { mechanic: mechanicProfile._id };

    if (status) {
      query.status = status;
    } else if (tab === 'pending') {
      query.status = 'REQUESTED';
    } else if (tab === 'active') {
      query.status = { $in: ['ACCEPTED', 'DIAGNOSING', 'REPAIRING', 'READY'] };
    } else if (tab === 'completed') {
      query.status = 'COMPLETED';
    } else if (tab === 'history') {
      query.status = { $in: ['COMPLETED', 'REJECTED', 'CANCELLED'] };
    }

    const requests = await ServiceRequest.find(query)
      .populate('customer', 'name email phone avatar')
      .populate('vehicle')
      .sort('-createdAt');

    return sendSuccess(res, 'Mechanic service requests retrieved', { requests });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single service request details with full timeline history
 * @route   GET /api/service-requests/:id
 * @access  Private
 */
export const getRequestById = async (req, res, next) => {
  try {
    const request = await ServiceRequest.findById(req.params.id)
      .populate('customer', 'name email phone avatar address city')
      .populate('vehicle')
      .populate('mechanic')
      .populate('statusHistory.updatedBy', 'name role');

    if (!request) {
      return sendError(res, 'Service request not found', 404);
    }

    // Access check: User must be either customer or mechanic owner
    const isCustomer = request.customer._id.toString() === req.user._id.toString();
    const isMechanic =
      req.mechanicProfile &&
      request.mechanic._id.toString() === req.mechanicProfile._id.toString();

    if (!isCustomer && !isMechanic) {
      return sendError(res, 'You are not authorized to view this service request', 403);
    }

    return sendSuccess(res, 'Service request details retrieved', { request });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update service request status (Mechanic workflow)
 * @route   PATCH /api/service-requests/:id/status
 * @access  Private (MECHANIC only)
 */
export const updateRequestStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, note, estimatedCost, finalCost, technicianNotes } = req.body;

    const mechanicProfile = await MechanicProfile.findOne({ user: req.user._id });
    if (!mechanicProfile) {
      return sendError(res, 'Mechanic profile not found', 404);
    }

    const serviceRequest = await ServiceRequest.findOne({
      _id: id,
      mechanic: mechanicProfile._id,
    })
      .populate('customer', 'name email phone')
      .populate('vehicle');

    if (!serviceRequest) {
      return sendError(res, 'Service request not found or unauthorized', 404);
    }

    const validStatuses = [
      'ACCEPTED',
      'DIAGNOSING',
      'REPAIRING',
      'READY',
      'COMPLETED',
      'REJECTED',
    ];

    if (!validStatuses.includes(status)) {
      return sendError(res, `Invalid status update: ${status}`, 400);
    }

    // Update status and history
    serviceRequest.updateStatus(
      status,
      note || `Status updated to ${status}`,
      req.user._id
    );

    if (estimatedCost !== undefined && estimatedCost !== '') {
      serviceRequest.estimatedCost = Number(estimatedCost);
    }
    if (finalCost !== undefined && finalCost !== '') {
      serviceRequest.finalCost = Number(finalCost);
    }
    if (technicianNotes !== undefined) {
      serviceRequest.technicianNotes = technicianNotes;
    }

    await serviceRequest.save();

    // Create status notification for customer
    const statusTitles = {
      ACCEPTED: 'Service Request Accepted! 🔧',
      DIAGNOSING: 'Vehicle Diagnosis Started 🔍',
      REPAIRING: 'Repair Work In Progress 🛠️',
      READY: 'Your Vehicle is Ready! 🚗✨',
      COMPLETED: 'Service Completed ✅',
      REJECTED: 'Service Request Declined ⚠️',
    };

    const notifTitle = statusTitles[status] || 'Service Status Update';
    const notifMsg = `${mechanicProfile.businessName} updated your repair status to: ${status}. ${note ? `Note: "${note}"` : ''}`;

    await Notification.create({
      recipient: serviceRequest.customer._id,
      sender: req.user._id,
      type: status === 'COMPLETED' ? 'SERVICE_COMPLETED' : 'STATUS_CHANGE',
      title: notifTitle,
      message: notifMsg,
      data: {
        serviceRequestId: serviceRequest._id,
        status,
      },
    });

    // Real-time socket emissions
    const payload = {
      requestId: serviceRequest._id,
      status,
      note,
      updatedAt: new Date(),
      estimatedCost: serviceRequest.estimatedCost,
      finalCost: serviceRequest.finalCost,
      technicianNotes: serviceRequest.technicianNotes,
      statusHistory: serviceRequest.statusHistory,
    };

    emitToUser(serviceRequest.customer._id, 'service_status_updated', payload);
    emitToRequestRoom(serviceRequest._id, 'service_status_updated', payload);

    return sendSuccess(res, `Service request status updated to ${status}`, {
      serviceRequest,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Cancel service request (Customer action)
 * @route   PATCH /api/service-requests/:id/cancel
 * @access  Private (CUSTOMER only)
 */
export const cancelRequest = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason = 'Cancelled by customer' } = req.body;

    const serviceRequest = await ServiceRequest.findOne({
      _id: id,
      customer: req.user._id,
    }).populate('mechanic');

    if (!serviceRequest) {
      return sendError(res, 'Service request not found', 404);
    }

    if (serviceRequest.status !== 'REQUESTED') {
      return sendError(
        res,
        'Cannot cancel request once the mechanic has accepted or started working on it.',
        400
      );
    }

    serviceRequest.updateStatus('CANCELLED', reason, req.user._id);
    await serviceRequest.save();

    // Notify Mechanic
    if (serviceRequest.mechanic) {
      const mech = await MechanicProfile.findById(serviceRequest.mechanic._id);
      if (mech && mech.user) {
        await Notification.create({
          recipient: mech.user,
          sender: req.user._id,
          type: 'GENERAL',
          title: 'Service Request Cancelled',
          message: `${req.user.name} cancelled their service request #${serviceRequest._id.toString().slice(-6)}.`,
          data: { serviceRequestId: serviceRequest._id },
        });

        emitToUser(mech.user, 'service_status_updated', {
          requestId: serviceRequest._id,
          status: 'CANCELLED',
          note: reason,
        });
      }
    }

    return sendSuccess(res, 'Service request cancelled successfully', { serviceRequest });
  } catch (error) {
    next(error);
  }
};
