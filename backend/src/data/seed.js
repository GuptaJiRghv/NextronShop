import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';
import { Product } from '../models/product.model.js';
import { User } from '../models/user.model.js';
import { Review, SEED_REVIEWS } from '../models/review.model.js';
import { PRODUCTS_SEED } from './products.seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const USERS_FILE = path.join(__dirname, 'users.json');

const DEFAULT_ADMIN = {
    id: 'usr_admin',
    name: 'Admin User',
    email: 'admin@omnyx.com',
    password: bcrypt.hashSync('admin', 10),
    role: 'admin',
    cart: [],
    wishlist: [],
};

export const seedInitialData = async () => {
    try {
        // 1. Seed Products if empty
        const productCount = await Product.countDocuments();
        if (productCount === 0) {
            console.log('[seeder] Seeding initial products catalogue...');
            await Product.insertMany(PRODUCTS_SEED);
            console.log(`[seeder] Successfully seeded ${PRODUCTS_SEED.length} products.`);
        }

        // 2. Seed Default Admin & migrate existing users from users.json if not present
        const adminUser = await User.findOne({ email: 'admin@omnyx.com' });
        if (!adminUser) {
            console.log('[seeder] Admin account not found in database. Initializing users...');
            let initialUsers = [DEFAULT_ADMIN];

            if (fs.existsSync(USERS_FILE)) {
                try {
                    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
                    const parsed = JSON.parse(raw);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        initialUsers = parsed;
                        if (!initialUsers.some((u) => u.email === DEFAULT_ADMIN.email)) {
                            initialUsers.unshift(DEFAULT_ADMIN);
                        }
                    }
                } catch (readErr) {
                    console.warn('[seeder] Warning reading users.json:', readErr.message);
                }
            }

            for (const user of initialUsers) {
                const exists = await User.findOne({ email: user.email.toLowerCase() });
                if (!exists) {
                    await User.create(user);
                }
            }
            console.log('[seeder] User initialization complete.');
        }

        // 3. Seed Reviews if empty
        const reviewCount = await Review.countDocuments();
        if (reviewCount === 0) {
            console.log('[seeder] Seeding initial verified product reviews...');
            await Review.insertMany(SEED_REVIEWS);
            console.log(`[seeder] Successfully seeded ${SEED_REVIEWS.length} reviews.`);
        }
    } catch (err) {
        console.error('[seeder] Error during initial data seeding:', err.message);
    }
};

export default seedInitialData;
