import Service from '../models/Service.js';
import MechanicProfile from '../models/MechanicProfile.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Get all services of a specific mechanic
 * @route   GET /api/services/mechanic/:mechanicId
 * @access  Public
 */
export const getMechanicServices = async (req, res, next) => {
  try {
    const { mechanicId } = req.params;
    const services = await Service.find({ mechanic: mechanicId }).sort('category price');
    return sendSuccess(res, 'Services retrieved', { services });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new service offering
 * @route   POST /api/services
 * @access  Private (MECHANIC only)
 */
export const createService = async (req, res, next) => {
  try {
    const mechanicProfile = await MechanicProfile.findOne({ user: req.user._id });
    if (!mechanicProfile) {
      return sendError(res, 'Mechanic profile not found', 404);
    }

    const { name, category, description, price, estimatedDuration, vehicleTypes, isAvailable } =
      req.body;

    if (!name || price === undefined) {
      return sendError(res, 'Service name and price are required', 400);
    }

    const service = await Service.create({
      mechanic: mechanicProfile._id,
      name,
      category: category || 'General Service',
      description: description || '',
      price: Number(price),
      estimatedDuration: estimatedDuration || '1-2 hours',
      vehicleTypes: vehicleTypes || ['Car', 'Bike', 'SUV'],
      isAvailable: isAvailable !== undefined ? Boolean(isAvailable) : true,
    });

    return sendSuccess(res, 'Service created successfully', { service }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a service offering
 * @route   PUT /api/services/:id
 * @access  Private (MECHANIC only)
 */
export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mechanicProfile = await MechanicProfile.findOne({ user: req.user._id });
    if (!mechanicProfile) {
      return sendError(res, 'Mechanic profile not found', 404);
    }

    const service = await Service.findOne({ _id: id, mechanic: mechanicProfile._id });
    if (!service) {
      return sendError(res, 'Service not found or unauthorized to edit', 404);
    }

    const { name, category, description, price, estimatedDuration, vehicleTypes, isAvailable } =
      req.body;

    if (name) service.name = name;
    if (category) service.category = category;
    if (description !== undefined) service.description = description;
    if (price !== undefined) service.price = Number(price);
    if (estimatedDuration) service.estimatedDuration = estimatedDuration;
    if (vehicleTypes) service.vehicleTypes = vehicleTypes;
    if (isAvailable !== undefined) service.isAvailable = Boolean(isAvailable);

    await service.save();

    return sendSuccess(res, 'Service updated successfully', { service });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a service offering
 * @route   DELETE /api/services/:id
 * @access  Private (MECHANIC only)
 */
export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const mechanicProfile = await MechanicProfile.findOne({ user: req.user._id });
    if (!mechanicProfile) {
      return sendError(res, 'Mechanic profile not found', 404);
    }

    const service = await Service.findOneAndDelete({ _id: id, mechanic: mechanicProfile._id });
    if (!service) {
      return sendError(res, 'Service not found or unauthorized to delete', 404);
    }

    return sendSuccess(res, 'Service deleted successfully');
  } catch (error) {
    next(error);
  }
};
