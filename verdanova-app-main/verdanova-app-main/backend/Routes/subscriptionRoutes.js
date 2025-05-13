const express = require('express');
const router = express.Router();
const subscriptionController = require('../Controllers/subscriptionController');


router.post('/', subscriptionController.createSubscription);
router.put('/:id', subscriptionController.updateSubscription);
router.delete('/:id', subscriptionController.deleteSubscription);
router.get('/', subscriptionController.getAllSubscriptionsWithUsers);
router.get('/user/:userId', subscriptionController.getUserSubscriptions);
router.get('/user/notTreatedSubs/:userId', subscriptionController.getUserUninvoicedSubscriptions);

module.exports = router;
