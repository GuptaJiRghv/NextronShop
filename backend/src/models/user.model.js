import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

const userSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: () => randomUUID(),
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'customer'],
            default: 'user',
        },
        cart: {
            type: Array,
            default: [],
        },
        wishlist: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);

const normalizeEmail = (email) => String(email || '').toLowerCase().trim();

const buildIdQuery = (id) => {
    const idStr = String(id);
    const conditions = [{ id: idStr }];
    if (mongoose.isValidObjectId(idStr)) {
        conditions.push({ _id: idStr });
    }
    return { $or: conditions };
};

export const findByEmail = async (email) => {
    return User.findOne({ email: normalizeEmail(email) }).lean();
};

export const findById = async (id) => {
    if (!id) return null;
    return User.findOne(buildIdQuery(id)).lean();
};

export const findAll = async () => {
    return User.find().lean();
};

export const create = async ({ id, name, email, password, role = 'user' }) => {
    const user = new User({
        id: id || randomUUID(),
        name: String(name).trim(),
        email: normalizeEmail(email),
        password,
        role,
        cart: [],
        wishlist: [],
    });

    const saved = await user.save();
    return saved.toObject();
};

export const update = async (id, patch) => {
    if (!id) return null;
    return User.findOneAndUpdate(buildIdQuery(id), { $set: patch }, { new: true }).lean();
};

/** Safe-to-expose view of a user (never includes the password hash). */
export const toPublic = (user) => {
    if (!user) return null;
    const { id, name, email, role, createdAt } = user;
    return { id, name, email, role, createdAt };
};
