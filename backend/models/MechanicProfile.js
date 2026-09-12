import mongoose from 'mongoose';

const mechanicProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    businessName: {
      type: String,
      required: [true, 'Please provide business/garage name'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide contact phone number'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Please provide workshop address'],
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'Please provide city'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        index: '2dsphere',
      },
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    verificationStatus: {
      type: String,
      enum: ['PENDING', 'VERIFIED'],
      default: 'VERIFIED', // Seeded and demo mechanics can be verified directly
    },
    experienceYears: {
      type: Number,
      default: 5,
    },
    emergencyService: {
      type: Boolean,
      default: false,
    },
    vehicleTypesSupported: {
      type: [String],
      enum: ['Car', 'Bike', 'Scooter', 'SUV', 'Other'],
      default: ['Car', 'Bike', 'SUV'],
    },
    workingHours: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '20:00' },
      days: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      },
    },
    specializations: {
      type: [String],
      default: ['General Servicing', 'Engine Diagnostics', 'Brake Repair', 'Electrical'],
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

mechanicProfileSchema.index({ location: '2dsphere' });
mechanicProfileSchema.index({ businessName: 'text', description: 'text', city: 'text' });

const MechanicProfile = mongoose.model('MechanicProfile', mechanicProfileSchema);
export default MechanicProfile;
