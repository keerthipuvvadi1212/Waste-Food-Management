import express from 'express';
import {
  getAllHygieneEvents,
  getHygieneEventById,
  createHygieneEvent,
  joinHygieneEvent,
  leaveHygieneEvent,
  getMyEvents,
} from '../controllers/hygiene.controller.js';
import { protect } from '../middlewares/auth.js';

const router = express.Router();

router.get('/', getAllHygieneEvents);
router.get('/user/my-events', protect, getMyEvents);
router.get('/:id', getHygieneEventById);

router.post('/', protect, createHygieneEvent);
router.post('/:id/join', protect, joinHygieneEvent);
router.post('/:id/leave', protect, leaveHygieneEvent);

export default router;
