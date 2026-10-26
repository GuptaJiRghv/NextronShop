import { Router } from 'express';
import { createOrder, getMyOrders, getOrder } from '../controllers/order.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', optionalAuthenticate, createOrder);
router.get('/', authenticate, getMyOrders);
router.get('/:id', authenticate, getOrder);

export default router;
