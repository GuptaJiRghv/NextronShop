import asyncHandler from '../utils/asyncHandler.js';
import { LOW_STOCK_THRESHOLD, ORDER_STATUSES } from '../utils/constants.js';
import * as UserModel from '../models/user.model.js';
import * as ProductModel from '../models/product.model.js';
import * as OrderModel from '../models/order.model.js';
import * as SupportModel from '../models/support.model.js';
import { changeOrderStatus } from '../services/order.service.js';

// GET /api/admin/stats
export const getStats = asyncHandler(async (req, res) => {
    const [users, products, orders] = await Promise.all([
        UserModel.findAll(),
        ProductModel.findAll(),
        OrderModel.findAll(),
    ]);

    const ordersByStatus = Object.fromEntries(ORDER_STATUSES.map((status) => [status, 0]));
    orders.forEach((order) => {
        ordersByStatus[order.status] = (ordersByStatus[order.status] ?? 0) + 1;
    });

    const revenue = orders
        .filter((order) => order.status !== 'Cancelled')
        .reduce((sum, order) => sum + order.total, 0);

    res.json({
        totalUsers: users.filter((user) => user.role === 'user').length,
        totalProducts: products.length,
        totalOrders: orders.length,
        revenue: Math.round(revenue * 100) / 100,
        lowStockCount: products.filter((product) => product.stock < LOW_STOCK_THRESHOLD).length,
        ordersByStatus,
    });
});

// GET /api/admin/orders   (every customer's orders)
export const getAllOrders = asyncHandler(async (req, res) => {
    res.json(await OrderModel.findAll());
});

// PATCH /api/admin/orders/:id/status   body: { status }
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const order = await changeOrderStatus(req.params.id, req.body?.status);
    res.json(order);
});

// GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
    const users = await UserModel.findAll();
    res.json(users.map(({ id, name, email, role, createdAt }) => ({ id, name, email, role, createdAt })));
});

// GET /api/admin/messages   (contact form submissions)
export const getMessages = asyncHandler(async (req, res) => {
    res.json(await SupportModel.findAllMessages());
});
