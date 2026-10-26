import { Router } from 'express';
import {
    getAllOrders,
    getMessages,
    getStats,
    getUsers,
    updateOrderStatus,
} from '../controllers/admin.controller.js';
import { authenticate, authorizeAdmin } from '../middleware/auth.middleware.js';

const router = Router();

router.use(authenticate, authorizeAdmin);

router.get('/stats', getStats);
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);
router.get('/users', getUsers);
router.get('/messages', getMessages);

export default router;
