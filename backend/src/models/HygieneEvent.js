import mongoose from 'mongoose';

const hygieneEventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add event details'],
      maxlength: [1500, 'Description cannot exceed 1500 characters'],
    },
    type: {
      type: String,
      required: [true, 'Please specify event type'],
      enum: ['cleanup', 'sanitation', 'awareness', 'waste_segregation', 'tree_plantation'],
      default: 'cleanup',
    },
    date: {
      type: Date,
      required: [true, 'Please specify the event date'],
    },
    time: {
      type: String,
      required: [true, 'Please specify time (e.g. 07:00 AM - 11:00 AM)'],
      default: '08:00 AM - 11:30 AM',
    },
    location: {
      address: {
        type: String,
        required: [true, 'Please specify location/neighborhood'],
      },
      city: {
        type: String,
        default: 'Bengaluru',
      },
      meetingPoint: {
        type: String,
        default: 'Main Community Center Entrance',
      },
      coordinates: {
        lat: { type: Number, default: 12.9716 },
        lng: { type: Number, default: 77.5946 },
      },
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    volunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    maxVolunteers: {
      type: Number,
      default: 30,
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    equipmentProvided: {
      type: [String],
      default: ['Gloves', 'Trash Bags', 'Safety Masks', 'Pickers', 'Sanitizer'],
    },
    impactMetrics: {
      wasteCollectedKg: { type: Number, default: 0 },
      areaCleanedSqM: { type: Number, default: 0 },
      segregatedPlasticKg: { type: Number, default: 0 },
    },
    images: {
      type: [String],
      default: [
        'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800',
      ],
    },
  },
  {
    timestamps: true,
  }
);

hygieneEventSchema.index({ date: 1, status: 1, 'location.city': 1 });

const HygieneEvent = mongoose.model('HygieneEvent', hygieneEventSchema);
export default HygieneEvent;
