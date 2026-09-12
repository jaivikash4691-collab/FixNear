import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    mechanic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MechanicProfile',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide service name'],
      trim: true,
    },
    category: {
      type: String,
      enum: [
        'General Service',
        'Engine Repair',
        'Brake Service',
        'Battery Service',
        'Tyre Service',
        'Oil Change',
        'AC Service',
        'Electrical Repair',
        'Car Wash',
        'Emergency Repair',
        'Suspension & Steering',
        'Diagnostics & Inspection',
        'Other',
      ],
      default: 'General Service',
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide starting price'],
      min: 0,
    },
    estimatedDuration: {
      type: String,
      default: '1-2 hours',
      trim: true,
    },
    vehicleTypes: {
      type: [String],
      enum: ['Car', 'Bike', 'Scooter', 'SUV', 'Other'],
      default: ['Car', 'Bike', 'SUV'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Service = mongoose.model('Service', serviceSchema);
export default Service;
