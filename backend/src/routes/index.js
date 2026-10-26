import { Router } from 'express';
import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import productRoutes from './product.routes.js';
import orderRoutes from './order.routes.js';
import adminRoutes from './admin.routes.js';
import supportRoutes from './support.routes.js';
import paymentRoutes from './payment.routes.js';

const router = Router();

// Drop countdown initialized to 3 days, 12 hours, 45 minutes, 22 seconds on server start
const INITIAL_DROP_SECONDS = (3 * 86400) + (12 * 3600) + (45 * 60) + 22; // 305,122 seconds
const serverBootTime = Date.now();
const dropTargetTime = serverBootTime + (INITIAL_DROP_SECONDS * 1000);

router.get('/health', (req, res) => {
    res.json({ status: 'ok', storage: 'in-memory', time: new Date().toISOString() });
});

router.get('/drop-timer', (req, res) => {
    const remainingSeconds = Math.max(0, Math.floor((dropTargetTime - Date.now()) / 1000));
    res.json({
        serverBootTime,
        targetTime: dropTargetTime,
        initialSeconds: INITIAL_DROP_SECONDS,
        remainingSeconds,
    });
});

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/admin', adminRoutes);
router.use('/support', supportRoutes);
router.use('/payments', paymentRoutes);

export default router;
