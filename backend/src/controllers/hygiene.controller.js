import HygieneEvent from '../models/HygieneEvent.js';
import User from '../models/User.js';

// @desc    Get all hygiene events with filters
// @route   GET /api/hygiene
// @access  Public
export const getAllHygieneEvents = async (req, res, next) => {
  try {
    const { type, status, city, search, limit = 50 } = req.query;
    const query = {};

    if (type && type !== 'all') {
      query.type = type;
    }

    if (status && status !== 'all') {
      query.status = status;
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

    const events = await HygieneEvent.find(query)
      .populate('organizer', 'name organization phone email avatar')
      .populate('volunteers', 'name email avatar organization')
      .sort({ date: 1 })
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single hygiene event by ID
// @route   GET /api/hygiene/:id
// @access  Public
export const getHygieneEventById = async (req, res, next) => {
  try {
    const event = await HygieneEvent.findById(req.params.id)
      .populate('organizer', 'name organization phone email avatar address')
      .populate('volunteers', 'name email avatar organization role phone');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Hygiene event not found',
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new hygiene event
// @route   POST /api/hygiene
// @access  Private (NGO, Admin, Volunteer)
export const createHygieneEvent = async (req, res, next) => {
  try {
    const {
      title,
      description,
      type,
      date,
      time,
      location,
      maxVolunteers,
      equipmentProvided,
      images,
    } = req.body;

    const event = await HygieneEvent.create({
      title,
      description,
      type: type || 'cleanup',
      date: date || new Date(Date.now() + 2 * 24 * 3600 * 1000), // Default 2 days from now
      time: time || '08:00 AM - 11:30 AM',
      location: {
        address: location?.address || 'Cubbon Park Main Gate',
        city: location?.city || 'Bengaluru',
        meetingPoint: location?.meetingPoint || 'Statue Entrance Plaza',
        coordinates: location?.coordinates || { lat: 12.9763, lng: 77.5929 },
      },
      organizer: req.user._id,
      volunteers: [req.user._id], // Creator is auto-enrolled
      maxVolunteers: maxVolunteers || 30,
      equipmentProvided: equipmentProvided || ['Gloves', 'Trash Bags', 'Masks', 'Tongs'],
      images: images && images.length > 0 ? images : undefined,
    });

    // Update organizer stats
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.drivesParticipated': 1 },
    });

    const populatedEvent = await HygieneEvent.findById(event._id)
      .populate('organizer', 'name organization phone email avatar')
      .populate('volunteers', 'name email avatar');

    res.status(201).json({
      success: true,
      message: 'Community hygiene drive organized successfully!',
      data: populatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Join an event as volunteer
// @route   POST /api/hygiene/:id/join
// @access  Private
export const joinHygieneEvent = async (req, res, next) => {
  try {
    const event = await HygieneEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Hygiene event not found',
      });
    }

    // Check if user already joined
    if (event.volunteers.some((v) => v.toString() === req.user._id.toString())) {
      return res.status(400).json({
        success: false,
        message: 'You have already joined this event!',
      });
    }

    if (event.volunteers.length >= event.maxVolunteers) {
      return res.status(400).json({
        success: false,
        message: 'This event has reached its maximum volunteer capacity.',
      });
    }

    event.volunteers.push(req.user._id);
    await event.save();

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { 'stats.drivesParticipated': 1 },
    });

    const populatedEvent = await HygieneEvent.findById(event._id)
      .populate('organizer', 'name organization phone email avatar')
      .populate('volunteers', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'You have successfully joined the community drive! See you there!',
      data: populatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Leave an event
// @route   POST /api/hygiene/:id/leave
// @access  Private
export const leaveHygieneEvent = async (req, res, next) => {
  try {
    const event = await HygieneEvent.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Hygiene event not found',
      });
    }

    event.volunteers = event.volunteers.filter(
      (v) => v.toString() !== req.user._id.toString()
    );
    await event.save();

    const populatedEvent = await HygieneEvent.findById(event._id)
      .populate('organizer', 'name organization phone email avatar')
      .populate('volunteers', 'name email avatar');

    res.status(200).json({
      success: true,
      message: 'You have left this event.',
      data: populatedEvent,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's organized or joined hygiene events
// @route   GET /api/hygiene/user/my-events
// @access  Private
export const getMyEvents = async (req, res, next) => {
  try {
    const events = await HygieneEvent.find({
      $or: [{ organizer: req.user._id }, { volunteers: req.user._id }],
    })
      .populate('organizer', 'name organization avatar')
      .populate('volunteers', 'name avatar')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};
