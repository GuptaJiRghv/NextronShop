import { Router } from 'express';
import { getUserData, updateCart, updateWishlist } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate);

router.get('/data', getUserData);
router.put('/cart', updateCart);
router.put('/wishlist', updateWishlist);

export default router;
