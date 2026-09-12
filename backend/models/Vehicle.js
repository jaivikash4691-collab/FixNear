import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vehicleType: {
      type: String,
      enum: ['Car', 'Bike', 'Scooter', 'SUV', 'Other'],
      required: [true, 'Please select a vehicle type'],
    },
    brand: {
      type: String,
      required: [true, 'Please provide vehicle brand (e.g. Honda, Yamaha)'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Please provide vehicle model (e.g. City, R15)'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Please provide manufacturing year'],
      min: 1980,
      max: new Date().getFullYear() + 1,
    },
    fuelType: {
      type: String,
      enum: ['Petrol', 'Diesel', 'Electric', 'CNG', 'Hybrid'],
      default: 'Petrol',
    },
    registrationNumber: {
      type: String,
      required: [true, 'Please provide registration / plate number'],
      uppercase: true,
      trim: true,
    },
    mileage: {
      type: Number,
      default: 0,
      min: 0,
    },
    image: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Vehicle = mongoose.model('Vehicle', vehicleSchema);
export default Vehicle;
