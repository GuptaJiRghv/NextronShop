import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as OrderModel from '../models/order.model.js';
import { placeOrder } from '../services/order.service.js';

// POST /api/orders   body: { items: [{ id, quantity }], customerInfo, date? }
export const createOrder = asyncHandler(async (req, res) => {
    const order = await placeOrder(req.user, req.body ?? {});
    res.status(201).json(order);
});

// GET /api/orders   (current user's orders, newest first)
export const getMyOrders = asyncHandler(async (req, res) => {
    res.json(await OrderModel.findByUser(req.user.id));
});

// GET /api/orders/:id   (owner or admin)
export const getOrder = asyncHandler(async (req, res) => {
    const order = await OrderModel.findById(req.params.id);
    if (!order) {
        throw new ApiError(404, 'ORDER_NOT_FOUND', 'Order not found.');
    }
    if (order.user !== req.user.id && req.user.role !== 'admin') {
        throw new ApiError(403, 'FORBIDDEN', 'You cannot view this order.');
    }
    res.json(order);
});
