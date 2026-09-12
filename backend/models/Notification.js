import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    type: {
      type: String,
      enum: [
        'NEW_REQUEST',
        'REQUEST_ACCEPTED',
        'REQUEST_REJECTED',
        'STATUS_CHANGE',
        'SERVICE_COMPLETED',
        'NEW_REVIEW',
        'GENERAL',
      ],
      default: 'GENERAL',
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      serviceRequestId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceRequest' },
      mechanicId: { type: mongoose.Schema.Types.ObjectId, ref: 'MechanicProfile' },
      vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
      customData: Object,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
