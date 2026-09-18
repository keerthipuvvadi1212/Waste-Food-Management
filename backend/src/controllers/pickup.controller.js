import PickupRequest from '../models/PickupRequest.js';
import FoodListing from '../models/FoodListing.js';

// @desc    Get user's pickup requests (as donor or claimant)
// @route   GET /api/pickups
// @access  Private
export const getMyPickups = async (req, res, next) => {
  try {
    const pickups = await PickupRequest.find({
      $or: [{ donor: req.user._id }, { claimedBy: req.user._id }],
    })
      .populate('foodListing')
      .populate('donor', 'name organization phone email avatar address')
      .populate('claimedBy', 'name organization phone email avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pickups.length,
      data: pickups,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pickup status (accepted, in_transit, delivered, cancelled)
// @route   PUT /api/pickups/:id/status
// @access  Private
export const updatePickupStatus = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const pickup = await PickupRequest.findById(req.params.id);

    if (!pickup) {
      return res.status(404).json({
        success: false,
        message: 'Pickup request not found',
      });
    }

    if (
      pickup.donor.toString() !== req.user._id.toString() &&
      pickup.claimedBy.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this pickup request',
      });
    }

    if (status) pickup.status = status;
    if (notes) pickup.notes = notes;
    await pickup.save();

    // If marked delivered, update food listing status as well
    if (status === 'delivered') {
      await FoodListing.findByIdAndUpdate(pickup.foodListing, {
        status: 'completed',
      });
    } else if (status === 'in_transit') {
      await FoodListing.findByIdAndUpdate(pickup.foodListing, {
        status: 'picked_up',
      });
    }

    const updated = await PickupRequest.findById(req.params.id)
      .populate('foodListing')
      .populate('donor', 'name organization phone email avatar')
      .populate('claimedBy', 'name organization phone email avatar');

    res.status(200).json({
      success: true,
      message: `Pickup status updated to ${status}`,
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};
