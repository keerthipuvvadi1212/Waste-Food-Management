import mongoose from 'mongoose';

const foodListingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a food title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description of the food'],
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['cooked', 'raw', 'packaged', 'bakery', 'beverages', 'fruits_veggies'],
      default: 'cooked',
    },
    quantity: {
      type: String,
      required: [true, 'Please specify the quantity (e.g. 15 kg, 50 meals)'],
    },
    servings: {
      type: Number,
      default: 10,
    },
    dietary: {
      type: String,
      enum: ['veg', 'non-veg', 'vegan', 'halal', 'all'],
      default: 'veg',
    },
    expiryDate: {
      type: Date,
      required: [true, 'Please provide an expiry date and time'],
    },
    storageInstructions: {
      type: String,
      default: 'Keep refrigerated until distribution',
    },
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please provide pickup address'],
      },
      city: {
        type: String,
        default: 'Bengaluru',
      },
      pincode: {
        type: String,
        default: '560001',
      },
      coordinates: {
        lat: { type: Number, default: 12.9716 },
        lng: { type: Number, default: 77.5946 },
      },
    },
    contactPhone: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['available', 'claimed', 'picked_up', 'completed', 'expired'],
      default: 'available',
    },
    claimedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800',
      ],
    },
    pickupWindow: {
      from: { type: String, default: '10:00 AM' },
      to: { type: String, default: '06:00 PM' },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high performance querying
foodListingSchema.index({ status: 1, 'location.city': 1, expiryDate: 1 });

const FoodListing = mongoose.model('FoodListing', foodListingSchema);
export default FoodListing;
