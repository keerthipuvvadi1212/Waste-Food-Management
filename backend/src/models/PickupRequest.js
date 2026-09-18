import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    foodListing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodListing',
      required: true,
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'in_transit', 'delivered', 'cancelled'],
      default: 'pending',
    },
    scheduledPickupTime: {
      type: String,
      default: 'Within 2 hours',
    },
    deliveryTarget: {
      type: String,
      default: 'Local Community Shelter / Slum Distribution',
    },
    notes: {
      type: String,
      default: '',
    },
    transportType: {
      type: String,
      enum: ['two_wheeler', 'van', 'auto', 'walking'],
      default: 'van',
    },
    verificationPin: {
      type: String,
      default: () => Math.floor(1000 + Math.random() * 9000).toString(),
    },
  },
  {
    timestamps: true,
  }
);

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;
