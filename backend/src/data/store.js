import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { PRODUCTS_SEED } from './products.seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const USERS_FILE = path.join(__dirname, 'users.json');

const DEFAULT_ADMIN = {
    id: 'usr_admin',
    name: 'Admin User',
    email: 'admin@omnyx.com',
    password: bcrypt.hashSync('admin', 10),
    role: 'admin',
    cart: [],
    wishlist: [],
    createdAt: new Date().toISOString(),
};

/**
 * Loads user records from the local users.json file.
 * If the file does not exist, it initializes with the default admin account.
 */
const loadInitialUsers = () => {
    try {
        if (fs.existsSync(USERS_FILE)) {
            const raw = fs.readFileSync(USERS_FILE, 'utf-8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                // Ensure default admin always exists
                const hasAdmin = parsed.some((u) => u.email === DEFAULT_ADMIN.email);
                if (!hasAdmin) {
                    parsed.unshift(DEFAULT_ADMIN);
                    fs.writeFileSync(USERS_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
                }
                return parsed;
            }
        }
    } catch (err) {
        console.error('Warning: could not read users.json, initializing default:', err);
    }

    const initial = [DEFAULT_ADMIN];
    try {
        fs.writeFileSync(USERS_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    } catch (err) {
        console.error('Warning: could not write initial users.json:', err);
    }
    return initial;
};

/**
 * Saves current store.users array to users.json on the local server filesystem.
 */
export const saveUsers = async () => {
    try {
        await fs.promises.writeFile(USERS_FILE, JSON.stringify(store.users, null, 2), 'utf-8');
    } catch (err) {
        console.error('Error saving users to local file:', err);
    }
};

/**
 * In-memory store backed by local JSON file for users (Evaluation 1).
 */
export const store = {
    users: loadInitialUsers(),
    products: PRODUCTS_SEED.map((product) => ({ ...product })),
    orders: [],
    messages: [],
    subscribers: [],
    counters: { order: 1000 },
};

