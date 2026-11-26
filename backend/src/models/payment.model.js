import mongoose from 'mongoose';

const paymentSessionSchema = new mongoose.Schema(
    {
        txId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        amount: {
            type: Number,
            required: true,
            default: 0,
        },
        orderData: {
            type: Object,
            default: null,
        },
        status: {
            type: String,
            default: 'pending',
            enum: ['pending', 'completed', 'failed', 'expired'],
            index: true,
        },
        completedAt: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const PaymentSession = mongoose.models.PaymentSession || mongoose.model('PaymentSession', paymentSessionSchema);

export const createSession = async ({ txId, amount, orderData }) => {
    const session = new PaymentSession({
        txId,
        amount: Number(amount) || 0,
        orderData: orderData || null,
        status: 'pending',
    });
    const saved = await session.save();
    return saved.toObject();
};

export const findByTxId = async (txId) => {
    return PaymentSession.findOne({ txId }).lean();
};

export const markCompleted = async (txId) => {
    const completedAt = new Date().toISOString();
    return PaymentSession.findOneAndUpdate(
        { txId },
        { $set: { status: 'completed', completedAt } },
        { new: true }
    ).lean();
};
