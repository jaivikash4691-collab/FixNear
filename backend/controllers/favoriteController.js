import Favorite from '../models/Favorite.js';
import MechanicProfile from '../models/MechanicProfile.js';
import Service from '../models/Service.js';
import { sendSuccess, sendError } from '../utils/responseHandler.js';

/**
 * @desc    Toggle saving a mechanic as favorite
 * @route   POST /api/favorites/:mechanicId
 * @access  Private (CUSTOMER only)
 */
export const toggleFavorite = async (req, res, next) => {
  try {
    const { mechanicId } = req.params;

    const mechanic = await MechanicProfile.findById(mechanicId);
    if (!mechanic) {
      return sendError(res, 'Mechanic not found', 404);
    }

    const existingFavorite = await Favorite.findOne({
      customer: req.user._id,
      mechanic: mechanicId,
    });

    if (existingFavorite) {
      await Favorite.findByIdAndDelete(existingFavorite._id);
      return sendSuccess(res, 'Mechanic removed from favorites', { isFavorited: false });
    } else {
      await Favorite.create({
        customer: req.user._id,
        mechanic: mechanicId,
      });
      return sendSuccess(res, 'Mechanic saved to favorites', { isFavorited: true });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get customer's saved favorite mechanics
 * @route   GET /api/favorites
 * @access  Private (CUSTOMER only)
 */
export const getMyFavorites = async (req, res, next) => {
  try {
    const favorites = await Favorite.find({ customer: req.user._id })
      .populate({
        path: 'mechanic',
        populate: { path: 'user', select: 'name avatar email phone' },
      })
      .sort('-createdAt');

    // Attach starting price to each mechanic
    const favoritesWithMeta = await Promise.all(
      favorites.map(async (fav) => {
        const favObj = fav.toObject();
        if (favObj.mechanic) {
          const services = await Service.find({
            mechanic: favObj.mechanic._id,
            isAvailable: true,
          }).sort('price');
          favObj.mechanic.startingPrice = services.length > 0 ? services[0].price : 0;
          favObj.mechanic.featuredServices = services.slice(0, 3).map((s) => s.name);
        }
        return favObj;
      })
    );

    return sendSuccess(res, 'Favorites retrieved', { favorites: favoritesWithMeta });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Check if a specific mechanic is favorited by the logged in customer
 * @route   GET /api/favorites/check/:mechanicId
 * @access  Private (CUSTOMER only)
 */
export const checkFavorite = async (req, res, next) => {
  try {
    const { mechanicId } = req.params;
    const favorite = await Favorite.findOne({
      customer: req.user._id,
      mechanic: mechanicId,
    });

    return sendSuccess(res, 'Favorite status checked', { isFavorited: !!favorite });
  } catch (error) {
    next(error);
  }
};
