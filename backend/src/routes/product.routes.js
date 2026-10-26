import { Router } from 'express';
import {
    createProduct,
    deleteProduct,
    getFeatured,
    getProduct,
    getTrending,
    listProducts,
    updateProduct,
} from '../controllers/product.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';
import { validateProduct } from '../middleware/validate.middleware.js';

const router = Router();

// Public
router.get('/', listProducts);
router.get('/trending', getTrending);
router.get('/featured', getFeatured);
router.get('/:id', getProduct);

// Admin only
router.post('/', authenticate, authorizeAdmin, validateProduct(false), createProduct);
router.put('/:id', authenticate, authorizeAdmin, validateProduct(true), updateProduct);
router.delete('/:id', authenticate, authorizeAdmin, deleteProduct);

export default router;
