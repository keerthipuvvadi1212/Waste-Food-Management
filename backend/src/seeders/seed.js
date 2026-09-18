import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'node:dns';
import User from '../models/User.js';
import FoodListing from '../models/FoodListing.js';
import HygieneEvent from '../models/HygieneEvent.js';
import PickupRequest from '../models/PickupRequest.js';

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore
}

dotenv.config();

const seedData = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      throw new Error('MONGODB_URI is not defined in environment variables.');
    }

    await mongoose.connect(mongoURI);
    console.log('🌱 Connected to MongoDB Atlas for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await FoodListing.deleteMany({});
    await HygieneEvent.deleteMany({});
    await PickupRequest.deleteMany({});
    console.log('🧹 Cleaned existing collections.');

    // 1. Create Users
    const users = await User.create([
      {
        name: 'Grand Spice Banquet & Caterers',
        email: 'donor@zerowaste.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 98451 22334',
        organization: 'Grand Spice Hospitality Group',
        address: {
          street: '45/2 Residency Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560025',
        },
        avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=256',
        bio: 'Premium wedding catering and corporate banquet reducing food waste through daily surplus donations.',
        stats: { mealsDonated: 1420, drivesParticipated: 0, foodClaimedKg: 0 },
      },
      {
        name: 'Ananya Sharma',
        email: 'volunteer@zerowaste.org',
        password: 'password123',
        role: 'volunteer',
        phone: '+91 97312 88490',
        organization: 'Green Earth Student Corps',
        address: {
          street: '12th Main, 4th Block Koramangala',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560034',
        },
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256',
        bio: 'Passionate climate activist and weekend volunteer coordinating food pickups and lake cleanup drives.',
        stats: { mealsDonated: 0, drivesParticipated: 14, foodClaimedKg: 280, wasteCollectedKg: 140 },
      },
      {
        name: 'Hope Foundation & Shelter Care',
        email: 'ngo@zerowaste.org',
        password: 'password123',
        role: 'ngo',
        phone: '+91 80 2345 6789',
        organization: 'Hope Community Foundation (Reg. NGO)',
        address: {
          street: '88 Jayanagar 7th Block',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560070',
        },
        avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=256',
        bio: 'Serving 500+ unhoused families and orphaned youth daily with nutritious food and clean hygiene kits.',
        stats: { mealsDonated: 0, drivesParticipated: 22, foodClaimedKg: 1850, wasteCollectedKg: 450 },
      },
      {
        name: 'System Administrator',
        email: 'admin@zerowaste.org',
        password: 'password123',
        role: 'admin',
        phone: '+91 99001 00200',
        organization: 'Zero Waste Alliance HQ',
        address: {
          street: 'Eco Tower, MG Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560001',
        },
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        bio: 'Platform management and community operations lead.',
        stats: { mealsDonated: 500, drivesParticipated: 30, foodClaimedKg: 900 },
      },
      {
        name: 'Green Leaf Artisan Bakery',
        email: 'bakery@zerowaste.org',
        password: 'password123',
        role: 'donor',
        phone: '+91 96112 33445',
        organization: 'Green Leaf Sourdough & Patisserie',
        address: {
          street: '77 CMH Road, Indiranagar',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560038',
        },
        avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=256',
        bio: 'Daily freshly baked whole wheat breads, croissants, and buns donating unsold batches.',
        stats: { mealsDonated: 680, drivesParticipated: 0, foodClaimedKg: 0 },
      },
    ]);

    console.log(`✅ Created ${users.length} demo users.`);

    const donor1 = users[0];
    const volunteer1 = users[1];
    const ngo1 = users[2];
    const admin1 = users[3];
    const donor2 = users[4];

    // 2. Create Food Listings
    const now = new Date();
    const listings = await FoodListing.create([
      {
        title: '50 Fresh Veg Biryani Meals with Raita & Dal',
        description: 'Surplus buffet food from lunch corporate event at Residency Road. Freshly prepared in food-grade thermal containers.',
        category: 'cooked',
        quantity: '25 kg (50 Servings)',
        servings: 50,
        dietary: 'veg',
        expiryDate: new Date(now.getTime() + 5 * 3600 * 1000), // 5 hours from now
        storageInstructions: 'Keep in thermal warmers or distribute within 3 hours.',
        donor: donor1._id,
        location: {
          address: '45/2 Residency Road, Near Brigade Junction',
          city: 'Bengaluru',
          pincode: '560025',
          coordinates: { lat: 12.9716, lng: 77.6075 },
        },
        contactPhone: '+91 98451 22334',
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=800',
        ],
        pickupWindow: { from: '03:00 PM', to: '07:00 PM' },
      },
      {
        title: 'Freshly Baked Whole Wheat & Multigrain Loaves (35 loaves)',
        description: 'Unsold artisanal loaves, sourdough, and dinner rolls baked this morning. 100% fresh and clean.',
        category: 'bakery',
        quantity: '35 Loaves / 18 kg',
        servings: 70,
        dietary: 'vegan',
        expiryDate: new Date(now.getTime() + 36 * 3600 * 1000), // 36 hours from now
        storageInstructions: 'Dry and room temperature storage.',
        donor: donor2._id,
        location: {
          address: '77 CMH Road, Indiranagar',
          city: 'Bengaluru',
          pincode: '560038',
          coordinates: { lat: 12.9784, lng: 77.6408 },
        },
        contactPhone: '+91 96112 33445',
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=800',
        ],
        pickupWindow: { from: '08:00 PM', to: '10:30 PM' },
      },
      {
        title: 'Raw Farm Vegetables & Seasonal Fruits (Potatoes, Tomatoes, Apples)',
        description: 'Crate boxes of fresh farm produce with minor cosmetic variations, completely nutritious and untouched.',
        category: 'fruits_veggies',
        quantity: '40 kg Assorted',
        servings: 120,
        dietary: 'vegan',
        expiryDate: new Date(now.getTime() + 48 * 3600 * 1000),
        storageInstructions: 'Cool ventilated area.',
        donor: donor1._id,
        location: {
          address: 'APMC Yard, Yeshwanthpur',
          city: 'Bengaluru',
          pincode: '560022',
          coordinates: { lat: 13.0281, lng: 77.5409 },
        },
        contactPhone: '+91 98451 22334',
        status: 'available',
        images: [
          'https://images.unsplash.com/photo-1610348725531-843dff563e2c?auto=format&fit=crop&q=80&w=800',
        ],
        pickupWindow: { from: '09:00 AM', to: '06:00 PM' },
      },
      {
        title: 'Packaged Fruit Juices & Energy Nutrition Bars (60 Units)',
        description: 'Sealed packaged tetra packs and healthy oat bars within 3 months of shelf life from exhibition surplus.',
        category: 'packaged',
        quantity: '60 Units',
        servings: 60,
        dietary: 'veg',
        expiryDate: new Date(now.getTime() + 72 * 3600 * 1000),
        storageInstructions: 'Dry storage, no direct sunlight.',
        donor: donor1._id,
        location: {
          address: 'Koramangala 5th Block Club Road',
          city: 'Bengaluru',
          pincode: '560095',
          coordinates: { lat: 12.9352, lng: 77.6245 },
        },
        contactPhone: '+91 98451 22334',
        status: 'claimed',
        claimedBy: ngo1._id,
        claimedAt: new Date(now.getTime() - 2 * 3600 * 1000),
        images: [
          'https://images.unsplash.com/photo-1622484216246-86c078b5ceea?auto=format&fit=crop&q=80&w=800',
        ],
        pickupWindow: { from: '11:00 AM', to: '05:00 PM' },
      },
    ]);

    console.log(`✅ Created ${listings.length} food listings.`);

    // 3. Create Hygiene Events
    const events = await HygieneEvent.create([
      {
        title: 'Ulsoor Lake Cleanliness & Plastic Segregation Drive',
        description: 'Join community volunteers and environmentalists to clean perimeter walking tracks, segregate single-use plastics, and install waste categorization bins.',
        type: 'cleanup',
        date: new Date(now.getTime() + 2 * 24 * 3600 * 1000), // 2 days from now
        time: '07:00 AM - 10:30 AM',
        location: {
          address: 'Ulsoor Lake Promenade, Sivanchetti Gardens',
          city: 'Bengaluru',
          meetingPoint: 'Main Lake Gazebo & Boat Club Entrance',
          coordinates: { lat: 12.9827, lng: 77.6206 },
        },
        organizer: ngo1._id,
        volunteers: [ngo1._id, volunteer1._id, admin1._id],
        maxVolunteers: 40,
        status: 'upcoming',
        equipmentProvided: ['Heavy-duty Gloves', 'Bio-degradable Trash Sacks', 'Metal Pickers', 'N95 Masks', 'Hand Sanitizer'],
        impactMetrics: { wasteCollectedKg: 0, areaCleanedSqM: 0, segregatedPlasticKg: 0 },
        images: [
          'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=800',
        ],
      },
      {
        title: 'Indiranagar Wet & Dry Waste Segregation Awareness Campaign',
        description: 'Door-to-door resident workshop demonstrating source segregation into wet, dry, and sanitary waste, plus distribution of color-coded compost bags.',
        type: 'waste_segregation',
        date: new Date(now.getTime() + 4 * 24 * 3600 * 1000),
        time: '09:00 AM - 12:30 PM',
        location: {
          address: 'Defence Colony Park, Indiranagar',
          city: 'Bengaluru',
          meetingPoint: 'Park Main Amphitheatre',
          coordinates: { lat: 12.9784, lng: 77.6408 },
        },
        organizer: volunteer1._id,
        volunteers: [volunteer1._id, ngo1._id],
        maxVolunteers: 25,
        status: 'upcoming',
        equipmentProvided: ['Info Pamphlets', 'Sample Segregation Bins', 'Badges', 'Refreshments'],
        impactMetrics: { wasteCollectedKg: 0, areaCleanedSqM: 0, segregatedPlasticKg: 0 },
        images: [
          'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
        ],
      },
      {
        title: 'Community Sanitation & Sanitizer Kit Distribution',
        description: 'Sanitization of high-touch community areas, bus stops, and distribution of hygiene hygiene soaps and essentials to unhoused families.',
        type: 'sanitation',
        date: new Date(now.getTime() - 2 * 24 * 3600 * 1000), // Past event
        time: '08:00 AM - 11:00 AM',
        location: {
          address: 'Majestic City Bus Terminal Surroundings',
          city: 'Bengaluru',
          meetingPoint: 'Platform 1 Entrance Concourse',
          coordinates: { lat: 12.9774, lng: 77.5708 },
        },
        organizer: ngo1._id,
        volunteers: [ngo1._id, volunteer1._id, admin1._id],
        maxVolunteers: 30,
        status: 'completed',
        equipmentProvided: ['Sprayers', 'Hygiene Kits', 'Gloves'],
        impactMetrics: { wasteCollectedKg: 280, areaCleanedSqM: 1200, segregatedPlasticKg: 95 },
        images: [
          'https://images.unsplash.com/photo-1584467735815-f778f274e296?auto=format&fit=crop&q=80&w=800',
        ],
      },
    ]);

    console.log(`✅ Created ${events.length} hygiene events.`);

    // 4. Create Pickup Requests
    const pickups = await PickupRequest.create([
      {
        foodListing: listings[3]._id, // Packaged fruit juices
        donor: donor1._id,
        claimedBy: ngo1._id,
        status: 'in_transit',
        scheduledPickupTime: 'Today by 04:30 PM',
        deliveryTarget: 'Hope Shelter Jayanagar & Slum Feeding Drive',
        notes: 'Volunteer van dispatched with 2 team members.',
        transportType: 'van',
        verificationPin: '4821',
      },
    ]);

    console.log(`✅ Created ${pickups.length} pickup requests.`);
    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  }
};

seedData();
