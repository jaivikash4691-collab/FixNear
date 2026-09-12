import mongoose from 'mongoose';

const serviceRequestSchema = new mongoose.Schema(
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
      index: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
    },
    serviceName: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    problemDescription: {
      type: String,
      required: [true, 'Please describe the problem / service needed'],
      trim: true,
    },
    problemImage: {
      type: String,
      default: '',
    },
    preferredDate: {
      type: String,
      required: [true, 'Please specify preferred date'],
    },
    preferredTime: {
      type: String,
      default: '09:00 AM',
    },
    status: {
      type: String,
      enum: [
        'REQUESTED',
        'ACCEPTED',
        'DIAGNOSING',
        'REPAIRING',
        'READY',
        'COMPLETED',
        'REJECTED',
        'CANCELLED',
      ],
      default: 'REQUESTED',
      index: true,
    },
    statusHistory: [
      {
        status: {
          type: String,
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        note: {
          type: String,
          default: '',
        },
        updatedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
      },
    ],
    estimatedCost: {
      type: Number,
      default: 0,
    },
    finalCost: {
      type: Number,
      default: 0,
    },
    technicianNotes: {
      type: String,
      default: '',
    },
    completionDate: {
      type: Date,
    },
    ratingGiven: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Helper method to advance status
serviceRequestSchema.methods.updateStatus = function (newStatus, note = '', updatedBy = null) {
  this.status = newStatus;
  this.statusHistory.push({
    status: newStatus,
    timestamp: new Date(),
    note,
    updatedBy,
  });
  if (newStatus === 'COMPLETED') {
    this.completionDate = new Date();
  }
};

const ServiceRequest = mongoose.model('ServiceRequest', serviceRequestSchema);
export default ServiceRequest;
