import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';
import adminRoutes from './admin.routes.js';
import supportRoutes from './support.routes.js';

const router = Router();

router.get('/health', (req, res) => {
    res.json({ status: 'ok', storage: 'in-memory', time: new Date().toISOString() });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/support', supportRoutes);

export default router;
