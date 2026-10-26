import { store } from '../data/store.js';

const copy = (order) => ({ ...order, items: order.items.map((item) => ({ ...item })) });

export const create = async ({ userId, items, total, customerInfo, date }) => {
    store.counters.order += 1;
    const now = new Date().toISOString();
    const order = {
        id: store.counters.order,
        user: userId,
        items,
        total,
        customerInfo,
        status: 'Processing',
        date: date || now,
        createdAt: now,
    };
    store.orders.unshift(order); // newest first
    return copy(order);
};

export const findAll = async () => store.orders.map(copy);

export const findByUser = async (userId) =>
    store.orders.filter((order) => order.user === userId).map(copy);

export const findById = async (id) => {
    const order = store.orders.find((entry) => entry.id === Number(id));
    return order ? copy(order) : null;
};

export const updateStatus = async (id, status) => {
    const order = store.orders.find((entry) => entry.id === Number(id));
    if (!order) return null;
    order.status = status;
    return copy(order);
};
