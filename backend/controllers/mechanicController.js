import MechanicProfile from '../models/MechanicProfile.js';
import Service from '../models/Service.js';
import Review from '../models/Review.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';
import { calculateDistanceKm } from '../utils/geoUtils.js';

/**
 * @desc    Get all mechanics with search, filters, distance & sorting
 * @route   GET /api/mechanics
 * @access  Public
 */
export const getMechanics = async (req, res, next) => {
  try {
    const {
      search,
      serviceCategory,
      vehicleType,
      minRating,
      emergencyService,
      isAvailable,
      city,
      lat,
      lng,
      radiusKm,
      sort = 'rating', // 'rating', 'nearest', 'reviews', 'price_asc'
    } = req.query;

    const query = {};

    // Only show verified mechanics by default
    query.verificationStatus = 'VERIFIED';

    // Availability filter
    if (isAvailable !== undefined && isAvailable !== '') {
      query.isAvailable = isAvailable === 'true';
    }

    // Emergency service filter
    if (emergencyService === 'true') {
      query.emergencyService = true;
    }

    // City filter
    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    // Vehicle type filter
    if (vehicleType) {
      query.vehicleTypesSupported = vehicleType;
    }

    // Minimum rating filter
    if (minRating) {
      query.averageRating = { $gte: parseFloat(minRating) };
    }

    // Text search in business name, description, city, specializations
    if (search) {
      query.$or = [
        { businessName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { specializations: { $regex: search, $options: 'i' } },
      ];
    }

    // Service category filter
    if (serviceCategory) {
      const servicesMatching = await Service.find({
        category: serviceCategory,
        isAvailable: true,
      }).distinct('mechanic');

      query._id = { $in: servicesMatching };
    }

    let mechanics = await MechanicProfile.find(query).populate('user', 'name email avatar phone');

    // Parse user coordinates if provided
    const userLat = lat ? parseFloat(lat) : null;
    const userLng = lng ? parseFloat(lng) : null;

    // Fetch lowest service price for each mechanic & compute distance
    const mechanicsWithMeta = await Promise.all(
      mechanics.map(async (mech) => {
        const mechObj = mech.toObject();

        // Calculate distance if coordinates available
        if (
          userLat &&
          userLng &&
          mech.location &&
          mech.location.coordinates &&
          mech.location.coordinates.length === 2
        ) {
          const [mechLng, mechLat] = mech.location.coordinates;
          mechObj.distanceKm = calculateDistanceKm(userLat, userLng, mechLat, mechLng);
        } else {
          mechObj.distanceKm = null;
        }

        // Get starting price and top services
        const services = await Service.find({ mechanic: mech._id, isAvailable: true }).sort('price');
        mechObj.startingPrice = services.length > 0 ? services[0].price : 0;
        mechObj.servicesCount = services.length;
        mechObj.featuredServices = services.slice(0, 4).map((s) => ({
          name: s.name,
          category: s.category,
          price: s.price,
        }));

        return mechObj;
      })
    );

    // Filter by radius if specified
    let filteredMechanics = mechanicsWithMeta;
    if (radiusKm && userLat && userLng) {
      const maxRadius = parseFloat(radiusKm);
      filteredMechanics = filteredMechanics.filter(
        (m) => m.distanceKm !== null && m.distanceKm <= maxRadius
      );
    }

    // Sorting
    filteredMechanics.sort((a, b) => {
      if (sort === 'nearest') {
        if (a.distanceKm === null) return 1;
        if (b.distanceKm === null) return -1;
        return a.distanceKm - b.distanceKm;
      } else if (sort === 'rating') {
        return (b.averageRating || 0) - (a.averageRating || 0);
      } else if (sort === 'reviews') {
        return (b.reviewCount || 0) - (a.reviewCount || 0);
      } else if (sort === 'price_asc') {
        return (a.startingPrice || 0) - (b.startingPrice || 0);
      }
      return (b.averageRating || 0) - (a.averageRating || 0);
    });

    return sendSuccess(res, 'Mechanics retrieved successfully', {
      count: filteredMechanics.length,
      mechanics: filteredMechanics,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get featured top-rated verified mechanics
 * @route   GET /api/mechanics/featured
 * @access  Public
 */
export const getFeaturedMechanics = async (req, res, next) => {
  try {
    const mechanics = await MechanicProfile.find({
      verificationStatus: 'VERIFIED',
      averageRating: { $gte: 4.0 },
    })
      .sort('-averageRating -reviewCount')
      .limit(6)
      .populate('user', 'name avatar');

    const result = await Promise.all(
      mechanics.map(async (m) => {
        const obj = m.toObject();
        const services = await Service.find({ mechanic: m._id, isAvailable: true }).sort('price');
        obj.startingPrice = services.length > 0 ? services[0].price : 0;
        obj.featuredServices = services.slice(0, 3).map((s) => s.name);
        return obj;
      })
    );

    return sendSuccess(res, 'Featured mechanics retrieved', { mechanics: result });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single mechanic profile by ID with services & reviews breakdown
 * @route   GET /api/mechanics/:id
 * @access  Public
 */
export const getMechanicById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.query;

    const mechanic = await MechanicProfile.findById(id).populate('user', 'name email avatar phone');
    if (!mechanic) {
      return sendError(res, 'Mechanic profile not found', 404);
    }

    const mechObj = mechanic.toObject();

    // Distance calculation if coords provided
    if (lat && lng && mechanic.location?.coordinates?.length === 2) {
      const [mechLng, mechLat] = mechanic.location.coordinates;
      mechObj.distanceKm = calculateDistanceKm(
        parseFloat(lat),
        parseFloat(lng),
        mechLat,
        mechLng
      );
    }

    // Get all services
    const services = await Service.find({ mechanic: id }).sort('category price');
    mechObj.services = services;
    mechObj.startingPrice = services.length > 0 ? services[0].price : 0;

    // Get recent reviews & distribution
    const reviews = await Review.find({ mechanic: id })
      .populate('customer', 'name avatar')
      .sort('-createdAt')
      .limit(20);

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const allReviews = await Review.find({ mechanic: id });
    allReviews.forEach((r) => {
      if (ratingCounts[r.rating] !== undefined) {
        ratingCounts[r.rating] += 1;
      }
    });

    mechObj.reviews = reviews;
    mechObj.ratingDistribution = ratingCounts;

    return sendSuccess(res, 'Mechanic details retrieved', { mechanic: mechObj });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get current logged in mechanic profile
 * @route   GET /api/mechanics/profile/me
 * @access  Private (MECHANIC only)
 */
export const getMyMechanicProfile = async (req, res, next) => {
  try {
    let profile = await MechanicProfile.findOne({ user: req.user._id }).populate(
      'user',
      'name email avatar phone'
    );

    if (!profile) {
      // Auto-create initial profile if not created
      profile = await MechanicProfile.create({
        user: req.user._id,
        businessName: `${req.user.name}'s Auto Care`,
        phone: req.user.phone || 'N/A',
        address: req.user.address || 'Service Road',
        city: req.user.city || 'Bangalore',
        location: req.user.location || {
          type: 'Point',
          coordinates: [77.5946, 12.9716],
        },
      });
    }

    const services = await Service.find({ mechanic: profile._id });

    return sendSuccess(res, 'Mechanic profile retrieved', {
      profile,
      services,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update current logged-in mechanic profile
 * @route   PUT /api/mechanics/profile
 * @access  Private (MECHANIC only)
 */
export const updateMyMechanicProfile = async (req, res, next) => {
  try {
    let profile = await MechanicProfile.findOne({ user: req.user._id });
    if (!profile) {
      profile = new MechanicProfile({ user: req.user._id });
    }

    const {
      businessName,
      description,
      phone,
      address,
      city,
      latitude,
      longitude,
      experienceYears,
      emergencyService,
      vehicleTypesSupported,
      workingHours,
      specializations,
      isAvailable,
      logo,
      coverImage,
    } = req.body;

    if (businessName) profile.businessName = businessName;
    if (description !== undefined) profile.description = description;
    if (phone) profile.phone = phone;
    if (address) profile.address = address;
    if (city) profile.city = city;
    if (experienceYears !== undefined) profile.experienceYears = Number(experienceYears);
    if (emergencyService !== undefined) profile.emergencyService = Boolean(emergencyService);
    if (vehicleTypesSupported) profile.vehicleTypesSupported = vehicleTypesSupported;
    if (workingHours) profile.workingHours = workingHours;
    if (specializations) profile.specializations = specializations;
    if (isAvailable !== undefined) profile.isAvailable = Boolean(isAvailable);
    if (logo) profile.logo = logo;
    if (coverImage) profile.coverImage = coverImage;

    if (longitude && latitude) {
      profile.location = {
        type: 'Point',
        coordinates: [parseFloat(longitude), parseFloat(latitude)],
      };
    }

    await profile.save();

    return sendSuccess(res, 'Mechanic profile updated successfully', { profile });
  } catch (error) {
    next(error);
  }
};
