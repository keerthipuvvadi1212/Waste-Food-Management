import express from 'express';
import {
  getMyPickups,
  updatePickupStatus,
} from '../controllers/pickup.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', protect, getMyPickups);
router.put('/:id/status', protect, updatePickupStatus);

export default router;
