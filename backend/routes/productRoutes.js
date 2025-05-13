import express from 'express';
import path from 'path';
import { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController.js';
import upload from '../middleware/upload.js';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const router = express.Router();

// Servir les fichiers images statiques depuis le répertoire 'uploads'
router.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route pour ajouter un produit avec une image
router.post('/products', upload.single('image'), createProduct);

// Autres routes...
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', upload.single('image'), updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
