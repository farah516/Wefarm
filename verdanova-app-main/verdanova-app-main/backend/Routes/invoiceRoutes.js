const express = require('express');
const router = express.Router();
const invoiceController = require('../Controllers/invoiceController');


router.post('/', invoiceController.createInvoice);
router.put('/:id', invoiceController.updateInvoice);
router.delete('/:id', invoiceController.deleteInvoice);
router.get('/', invoiceController.getAllInvoicesWithDetails);
router.get('/user/:userId', invoiceController.getUserInvoices);
router.get('/pdf/:id', invoiceController.generateInvoicePdf);

module.exports = router;
