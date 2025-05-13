const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/notificationController');

router.delete('/:id', notificationController.deleteNotification);
router.get('/:id/:role', notificationController.getUserNotifications);

module.exports = router;
