import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MechanicProfile',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

favoriteSchema.index({ customer: 1, mechanic: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
