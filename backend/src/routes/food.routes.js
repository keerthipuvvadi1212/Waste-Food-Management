import express from 'express';
import {
  getAllFoodListings,
  getFoodListingById,
  createFoodListing,
  claimFoodListing,
  updateFoodListing,
  deleteFoodListing,
  getMyListings,
} from '../controllers/food.controller.js';
import { protect } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

router.get('/', getAllFoodListings);
router.get('/user/my-listings', protect, getMyListings);
router.get('/:id', getFoodListingById);

router.post('/', protect, authorize('donor', 'admin'), createFoodListing);
router.post(
  '/:id/claim',
  protect,
  authorize('ngo', 'volunteer', 'admin'),
  claimFoodListing
);
router.put('/:id', protect, updateFoodListing);
router.delete('/:id', protect, deleteFoodListing);

export default router;
