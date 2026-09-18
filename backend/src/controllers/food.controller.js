import FoodListing from '../models/FoodListing.js';
import PickupRequest from '../models/PickupRequest.js';
import User from '../models/User.js';

// @desc    Get all food listings with filters (search, category, status, dietary, city)
// @route   GET /api/food
// @access  Public
export const getAllFoodListings = async (req, res, next) => {
  try {
    const { category, status, search, city, dietary, limit = 50 } = req.query;
    const query = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (dietary && dietary !== 'all') {
      query.dietary = dietary;
    }

    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.address': { $regex: search, $options: 'i' } },
      ];
    }

    const listings = await FoodListing.find(query)
      .populate('donor', 'name organization phone email avatar address')
      .populate('claimedBy', 'name organization phone email avatar')
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single food listing by ID
// @route   GET /api/food/:id
// @access  Public
export const getFoodListingById = async (req, res, next) => {
  try {
    const listing = await FoodListing.findById(req.params.id)
      .populate('donor', 'name organization phone email avatar address')
      .populate('claimedBy', 'name organization phone email avatar');

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found',
      });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new food listing
// @route   POST /api/food
// @access  Private (Donor, Admin)
export const createFoodListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      category,
      quantity,
      servings,
      dietary,
      expiryDate,
      storageInstructions,
      location,
      contactPhone,
      images,
      pickupWindow,
    } = req.body;

    const listing = await FoodListing.create({
      title,
      description,
      category: category || 'cooked',
      quantity,
      servings: servings || 10,
      dietary: dietary || 'veg',
      expiryDate: expiryDate || new Date(Date.now() + 6 * 3600 * 1000), // Default 6 hours ahead
      storageInstructions: storageInstructions || 'Refrigerate until pickup',
      donor: req.user._id,
      location: {
        address: location?.address || req.user.address?.street || 'Indiranagar 100 Feet Rd',
        city: location?.city || req.user.address?.city || 'Bengaluru',
        pincode: location?.pincode || '560038',
        coordinates: location?.coordinates || { lat: 12.9716, lng: 77.5946 },
      },
      contactPhone: contactPhone || req.user.phone || '+91 98765 43210',
      images: images && images.length > 0 ? images : undefined,
      pickupWindow: pickupWindow || { from: '09:00 AM', to: '07:00 PM' },
    });

    // Increment donor meals donated stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.mealsDonated': Number(servings) || 10 },
    });

    const populatedListing = await FoodListing.findById(listing._id).populate(
      'donor',
      'name organization phone email avatar'
    );

    res.status(201).json({
      success: true,
      message: 'Food donation posted successfully!',
      data: populatedListing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Claim food listing & create a pickup request
// @route   POST /api/food/:id/claim
// @access  Private (NGO, Volunteer, Admin)
export const claimFoodListing = async (req, res, next) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found',
      });
    }

    if (listing.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `This food listing is already ${listing.status}.`,
      });
    }

    listing.status = 'claimed';
    listing.claimedBy = req.user._id;
    listing.claimedAt = new Date();
    await listing.save();

    // Create a corresponding pickup request
    const pickup = await PickupRequest.create({
      foodListing: listing._id,
      donor: listing.donor,
      claimedBy: req.user._id,
      status: 'pending',
      scheduledPickupTime: req.body.scheduledPickupTime || 'Within 2 hours',
      deliveryTarget: req.body.deliveryTarget || 'Local Community Center & Slum Outreach',
      notes: req.body.notes || '',
      transportType: req.body.transportType || 'van',
    });

    // Update user stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.foodClaimedKg': 15 },
    });

    res.status(200).json({
      success: true,
      message: 'Food successfully claimed! Pickup request initiated.',
      data: {
        listing,
        pickup,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food listing
// @route   PUT /api/food/:id
// @access  Private (Owner, Admin)
export const updateFoodListing = async (req, res, next) => {
  try {
    let listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found',
      });
    }

    // Ensure user is listing owner or admin
    if (
      listing.donor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this listing',
      });
    }

    listing = await FoodListing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('donor', 'name organization phone email avatar')
      .populate('claimedBy', 'name organization phone email avatar');

    res.status(200).json({
      success: true,
      message: 'Food listing updated successfully',
      data: listing,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food listing
// @route   DELETE /api/food/:id
// @access  Private (Owner, Admin)
export const deleteFoodListing = async (req, res, next) => {
  try {
    const listing = await FoodListing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Food listing not found',
      });
    }

    if (
      listing.donor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this listing',
      });
    }

    await FoodListing.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Food listing removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get listings created by current user
// @route   GET /api/food/user/my-listings
// @access  Private
export const getMyListings = async (req, res, next) => {
  try {
    const listings = await FoodListing.find({ donor: req.user._id })
      .populate('claimedBy', 'name organization phone email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: listings.length,
      data: listings,
    });
  } catch (error) {
    next(error);
  }
};
