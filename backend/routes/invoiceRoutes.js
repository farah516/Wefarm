import express from 'express';
import multer from 'multer';
import { getInvoices, createInvoice, uploadInvoiceFile , deleteInvoice} from '../controllers/invoiceController.js';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/invoices', getInvoices);
router.post('/invoices', upload.single('file'), createInvoice);
router.post('/upload', upload.single('file'), uploadInvoiceFile);
router.delete('/invoices/:id', deleteInvoice);

export default router;
