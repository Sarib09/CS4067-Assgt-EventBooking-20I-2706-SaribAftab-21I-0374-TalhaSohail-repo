const express = require('express');
const router = express.Router();
const Notification = require('../models/notificationModel');
const { logger } = require('../utils/logger');

/**
 * @route GET /api/notifications
 * @desc Get all notifications for a user
 * @access Public
 */
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    const notifications = await Notification.find({ userEmail })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(notifications);
  } catch (error) {
    logger.error('Error fetching notifications:', error);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

/**
 * @route PUT /api/notifications/:id/read
 * @desc Mark a notification as read
 * @access Public
 */
router.put('/:id/read', async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    res.json(notification);
  } catch (error) {
    logger.error('Error marking notification as read:', error);
    res.status(500).json({ message: 'Error marking notification as read' });
  }
});

/**
 * @route PUT /api/notifications/read-all
 * @desc Mark all notifications as read for a user
 * @access Public
 */
router.put('/read-all', async (req, res) => {
  try {
    const { userEmail } = req.body;
    if (!userEmail) {
      return res.status(400).json({ message: 'User email is required' });
    }

    await Notification.updateMany(
      { userEmail, read: false },
      { read: true }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    logger.error('Error marking all notifications as read:', error);
    res.status(500).json({ message: 'Error marking all notifications as read' });
  }
});

module.exports = router; 