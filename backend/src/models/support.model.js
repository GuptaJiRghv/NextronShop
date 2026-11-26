import mongoose from 'mongoose';
import { randomUUID } from 'node:crypto';

const messageSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            default: () => randomUUID(),
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        subject: {
            type: String,
            default: '',
            trim: true,
        },
        message: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

const subscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema);
export const Subscriber = mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

export const createMessage = async ({ name, email, subject, message }) => {
    const entry = new Message({
        id: randomUUID(),
        name,
        email,
        subject,
        message,
    });
    const saved = await entry.save();
    return saved.toObject();
};

export const findAllMessages = async () => {
    return Message.find().sort({ createdAt: -1 }).lean();
};

export const addSubscriber = async (email) => {
    const normalized = String(email || '').toLowerCase().trim();
    if (!normalized) return { created: false };

    try {
        const existing = await Subscriber.findOne({ email: normalized });
        if (existing) {
            return { created: false };
        }
        await Subscriber.create({ email: normalized });
        return { created: true };
    } catch (err) {
        if (err.code === 11000) return { created: false };
        throw err;
    }
};
