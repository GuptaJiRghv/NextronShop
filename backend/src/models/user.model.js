import { randomUUID } from 'node:crypto';
import { store } from '../data/store.js';

const normalizeEmail = (email) => String(email).toLowerCase().trim();

// All functions are async so a real database can replace the store later
// without changing any controller or service.

export const findByEmail = async (email) =>
    store.users.find((user) => user.email === normalizeEmail(email)) ?? null;

export const findById = async (id) =>
    store.users.find((user) => user.id === id) ?? null;

export const findAll = async () => [...store.users];

export const create = async ({ name, email, password, role = 'user' }) => {
    const user = {
        id: randomUUID(),
        name: String(name).trim(),
        email: normalizeEmail(email),
        password,
        role,
        cart: [],
        wishlist: [],
        createdAt: new Date().toISOString(),
    };
    store.users.push(user);
    return user;
};

export const update = async (id, patch) => {
    const user = store.users.find((entry) => entry.id === id);
    if (!user) return null;
    Object.assign(user, patch);
    return user;
};

/** Safe-to-expose view of a user (never includes the password hash). */
export const toPublic = ({ id, name, email, role }) => ({ id, name, email, role });
