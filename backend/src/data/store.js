import bcrypt from 'bcryptjs';
import { PRODUCTS_SEED } from './products.seed.js';

/**
 * In-memory "database" used for Evaluation 1.
 *
 * Everything lives in plain arrays and resets whenever the server restarts.
 * Only the files in ../models touch this object, so replacing it with a real
 * database later means rewriting the models and nothing else.
 */
export const store = {
    users: [],
    products: PRODUCTS_SEED.map((product) => ({ ...product })),
    orders: [],
    messages: [],
    subscribers: [],
    counters: { order: 1000 },
};

// Default admin account (email: admin@nextron.com, password: admin)
store.users.push({
    id: 'usr_admin',
    name: 'Admin User',
    email: 'admin@nextron.com',
    password: bcrypt.hashSync('admin', 10),
    role: 'admin',
    cart: [],
    wishlist: [],
    createdAt: new Date().toISOString(),
});
