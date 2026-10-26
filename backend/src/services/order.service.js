import ApiError from '../utils/ApiError.js';
import { ORDER_STATUSES } from '../utils/constants.js';
import * as OrderModel from '../models/order.model.js';
import * as ProductModel from '../models/product.model.js';
import * as UserModel from '../models/user.model.js';

const round2 = (value) => Math.round(value * 100) / 100;

const text = (value) => (typeof value === 'string' ? value.trim() : '');

/**
 * Keeps only the shipping fields and the last 4 card digits.
 * The full card number, expiry and CVV are never stored.
 */
const sanitizeCustomerInfo = (info = {}) => {
    const cleaned = {
        fullName: text(info.fullName || info.name),
        email: text(info.email),
        phone: text(info.phone),
        address: text(info.address),
        city: text(info.city),
        state: text(info.state || ''),
        zipCode: text(info.zipCode || info.postalCode),
        country: text(info.country || 'United States'),
        paymentMethod: text(info.paymentMethod || 'QR Mobile Payment'),
        txId: text(info.txId || ''),
    };

    if (!cleaned.fullName || !cleaned.address || !cleaned.city) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Name, address and city are required to place an order.');
    }

    const digits = String(info.cardNumber ?? '').replace(/\D/g, '');
    cleaned.payment = {
        method: cleaned.paymentMethod,
        last4: digits.slice(-4) || null,
        txId: cleaned.txId || null,
    };

    return cleaned;
};

/**
 * Validates the cart against the live catalogue, prices it on the server,
 * reduces stock, saves the order and empties the user's cart.
 */
export const placeOrder = async (user, { items, customerInfo, date }) => {
    if (!Array.isArray(items) || items.length === 0) {
        throw new ApiError(400, 'EMPTY_ORDER', 'Your order has no items.');
    }

    // Merge duplicate lines so stock is checked against the combined quantity.
    const requested = new Map();
    for (const item of items) {
        const id = Number(item?.id);
        const quantity = Number(item?.quantity);
        if (!Number.isInteger(id) || !Number.isInteger(quantity) || quantity < 1) {
            throw new ApiError(400, 'INVALID_ITEM', 'Each item needs a valid id and a quantity of at least 1.');
        }
        requested.set(id, (requested.get(id) ?? 0) + quantity);
    }

    const lines = [];
    for (const [id, quantity] of requested) {
        const product = await ProductModel.findById(id);
        if (!product) {
            throw new ApiError(404, 'PRODUCT_NOT_FOUND', `Product ${id} no longer exists.`);
        }
        if (product.stock < quantity) {
            throw new ApiError(
                409,
                'OUT_OF_STOCK',
                product.stock === 0
                    ? `${product.name} is out of stock.`
                    : `Only ${product.stock} unit(s) of ${product.name} left.`
            );
        }
        lines.push({ product, quantity });
    }

    const info = sanitizeCustomerInfo(customerInfo);

    for (const { product, quantity } of lines) {
        await ProductModel.adjustStock(product.id, -quantity);
    }

    const orderItems = lines.map(({ product, quantity }) => ({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price,
        image: product.image,
        quantity,
    }));

    const total = round2(orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0));

    const order = await OrderModel.create({
        userId: user.id,
        items: orderItems,
        total,
        customerInfo: info,
        date,
    });

    await UserModel.update(user.id, { cart: [] });

    return order;
};

/** Changes an order's status; cancelling an order puts its items back in stock. */
export const changeOrderStatus = async (orderId, status) => {
    if (!ORDER_STATUSES.includes(status)) {
        throw new ApiError(400, 'VALIDATION_ERROR', `Status must be one of: ${ORDER_STATUSES.join(', ')}.`);
    }

    const existing = await OrderModel.findById(orderId);
    if (!existing) {
        throw new ApiError(404, 'ORDER_NOT_FOUND', 'Order not found.');
    }

    if (existing.status === status) return existing;

    if (status === 'Cancelled') {
        for (const item of existing.items) {
            await ProductModel.adjustStock(item.id, item.quantity);
        }
    } else if (existing.status === 'Cancelled') {
        throw new ApiError(409, 'ORDER_CANCELLED', 'A cancelled order cannot be reopened.');
    }

    return OrderModel.updateStatus(orderId, status);
};
