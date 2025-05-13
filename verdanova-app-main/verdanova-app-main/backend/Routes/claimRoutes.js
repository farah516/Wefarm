const express = require('express');
const router = express.Router();
const claimController = require('../Controllers/claimController');

router.post('/assign', claimController.assignAdminToClaim);
router.post('/:id', claimController.createClaim);
router.put('/:id', claimController.updateClaim);
router.delete('/:id', claimController.deleteClaim);
router.get('/me/:id', claimController.getUserClaims);
router.get('/', claimController.getAllClaims);
router.get('/admin/:id', claimController.getClaimsByAdmin);
router.post('/:claimId/respond', claimController.respondToClaim);

module.exports = router;
