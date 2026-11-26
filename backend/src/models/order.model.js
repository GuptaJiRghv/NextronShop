import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        user: {
            type: String,
            required: true,
            index: true,
        },
        items: {
            type: Array,
            required: true,
            default: [],
        },
        total: {
            type: Number,
            required: true,
            min: 0,
        },
        customerInfo: {
            type: Object,
            required: true,
        },
        status: {
            type: String,
            default: 'Processing',
        },
        date: {
            type: String,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);

const buildOrderIdQuery = (id) => {
    const num = Number(id);
    const conditions = [];
    if (!Number.isNaN(num)) {
        conditions.push({ id: num });
    }
    if (mongoose.isValidObjectId(id)) {
        conditions.push({ _id: id });
    }
    return conditions.length > 0 ? { $or: conditions } : { id: -1 };
};

export const create = async ({ userId, items, total, customerInfo, date }) => {
    const lastOrder = await Order.findOne().sort({ id: -1 }).select('id').lean();
    const nextId = Math.max(1000, lastOrder?.id || 1000) + 1;
    const now = new Date().toISOString();

    const order = new Order({
        id: nextId,
        user: String(userId),
        items: items.map((item) => ({ ...item })),
        total,
        customerInfo,
        status: 'Processing',
        date: date || now,
    });

    const saved = await order.save();
    return saved.toObject();
};

export const findAll = async () => {
    return Order.find().sort({ createdAt: -1 }).lean();
};

export const findByUser = async (userId) => {
    return Order.find({ user: String(userId) }).sort({ createdAt: -1 }).lean();
};

export const findById = async (id) => {
    return Order.findOne(buildOrderIdQuery(id)).lean();
};

export const updateStatus = async (id, status) => {
    return Order.findOneAndUpdate(buildOrderIdQuery(id), { $set: { status } }, { new: true }).lean();
};
