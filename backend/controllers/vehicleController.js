import Vehicle from '../models/Vehicle.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Get all vehicles belonging to current customer
 * @route   GET /api/vehicles
 * @access  Private (CUSTOMER only)
 */
export const getMyVehicles = async (req, res, next) => {
  try {
    const vehicles = await Vehicle.find({ owner: req.user._id }).sort('-createdAt');
    return sendSuccess(res, 'Vehicles retrieved successfully', { vehicles });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single vehicle details
 * @route   GET /api/vehicles/:id
 * @access  Private (CUSTOMER only)
 */
export const getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      return sendError(res, 'Vehicle not found', 404);
    }
    return sendSuccess(res, 'Vehicle details retrieved', { vehicle });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add a new vehicle
 * @route   POST /api/vehicles
 * @access  Private (CUSTOMER only)
 */
export const createVehicle = async (req, res, next) => {
  try {
    const {
      vehicleType,
      brand,
      model,
      year,
      fuelType,
      registrationNumber,
      mileage,
      image,
      notes,
    } = req.body;

    if (!vehicleType || !brand || !model || !year || !registrationNumber) {
      return sendError(
        res,
        'Vehicle type, brand, model, year, and registration number are required',
        400
      );
    }

    const vehicle = await Vehicle.create({
      owner: req.user._id,
      vehicleType,
      brand,
      model,
      year: Number(year),
      fuelType: fuelType || 'Petrol',
      registrationNumber: registrationNumber.toUpperCase().trim(),
      mileage: mileage ? Number(mileage) : 0,
      image: image || '',
      notes: notes || '',
    });

    return sendSuccess(res, 'Vehicle added successfully', { vehicle }, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a vehicle
 * @route   PUT /api/vehicles/:id
 * @access  Private (CUSTOMER only)
 */
export const updateVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOne({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      return sendError(res, 'Vehicle not found', 404);
    }

    const {
      vehicleType,
      brand,
      model,
      year,
      fuelType,
      registrationNumber,
      mileage,
      image,
      notes,
    } = req.body;

    if (vehicleType) vehicle.vehicleType = vehicleType;
    if (brand) vehicle.brand = brand;
    if (model) vehicle.model = model;
    if (year) vehicle.year = Number(year);
    if (fuelType) vehicle.fuelType = fuelType;
    if (registrationNumber) vehicle.registrationNumber = registrationNumber.toUpperCase().trim();
    if (mileage !== undefined) vehicle.mileage = Number(mileage);
    if (image !== undefined) vehicle.image = image;
    if (notes !== undefined) vehicle.notes = notes;

    await vehicle.save();

    return sendSuccess(res, 'Vehicle updated successfully', { vehicle });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a vehicle
 * @route   DELETE /api/vehicles/:id
 * @access  Private (CUSTOMER only)
 */
export const deleteVehicle = async (req, res, next) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!vehicle) {
      return sendError(res, 'Vehicle not found', 404);
    }
    return sendSuccess(res, 'Vehicle deleted successfully');
  } catch (error) {
    next(error);
  }
};
