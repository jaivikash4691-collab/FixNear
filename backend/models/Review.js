import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    serviceRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceRequest',
      required: true,
      unique: true, // Prevent duplicate reviews for same service request
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MechanicProfile',
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, 'Please provide your review feedback'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Static method to recalculate average rating of mechanic
reviewSchema.statics.calcAverageRating = async function (mechanicId) {
  const stats = await this.aggregate([
    { $match: { mechanic: mechanicId } },
    {
      $group: {
        _id: '$mechanic',
        averageRating: { $avg: '$rating' },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await mongoose.model('MechanicProfile').findByIdAndUpdate(mechanicId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount: stats[0].reviewCount,
    });
  } else {
    await mongoose.model('MechanicProfile').findByIdAndUpdate(mechanicId, {
      averageRating: 0,
      reviewCount: 0,
    });
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calcAverageRating(this.mechanic);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
