import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        productId: {
            type: Number,
            required: true,
            index: true,
        },
        userName: {
            type: String,
            default: 'Anonymous Operative',
        },
        userRole: {
            type: String,
            default: 'Verified Customer',
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            default: 'Exceptional Gear',
        },
        comment: {
            type: String,
            default: 'No written comments provided.',
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

export const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export const SEED_REVIEWS = [
    {
        id: 'rev_101',
        productId: 1,
        userName: 'Kaelen Vance',
        userRole: 'Verified Operative',
        rating: 5,
        title: 'Unbelievable Spatial Staging',
        comment: 'Spatial audio positioning in low-latency mode is unmatched for net-running. Noise cancellation cuts out 99% of urban noise.',
        date: new Date(Date.now() - 86400000 * 4).toISOString(),
    },
    {
        id: 'rev_102',
        productId: 1,
        userName: 'Sora Tanaka',
        userRole: 'Verified Buyer',
        rating: 5,
        title: 'Carbon-Fiber Masterpiece',
        comment: 'The tactile dial feedback and carbon-fiber headband are ultra-premium. Best hardware investment this quarter.',
        date: new Date(Date.now() - 86400000 * 12).toISOString(),
    },
    {
        id: 'rev_103',
        productId: 1,
        userName: 'Dax R.',
        userRole: 'Verified Buyer',
        rating: 4,
        title: 'Phenomenal Battery Life',
        comment: 'Soundstage is astonishing. Battery easily lasts over 38 hours on continuous high-bandwidth neural streaming.',
        date: new Date(Date.now() - 86400000 * 25).toISOString(),
    },
    {
        id: 'rev_201',
        productId: 7,
        userName: 'Nyx_01',
        userRole: 'Cyber Architect',
        rating: 5,
        title: 'Compiles Microservices Cold',
        comment: 'Compact powerhouse. Compiles full-stack microservices without breaking a thermal sweat. Vapor chamber cooling is whisper quiet.',
        date: new Date(Date.now() - 86400000 * 6).toISOString(),
    },
    {
        id: 'rev_202',
        productId: 7,
        userName: 'Elena Rostova',
        userRole: 'Verified Buyer',
        rating: 5,
        title: 'OLED Display is Beyond Reality',
        comment: 'Colors pop like nothing else. Keyboard switches feel crisp with zero flex on the magnesium frame.',
        date: new Date(Date.now() - 86400000 * 18).toISOString(),
    },
    {
        id: 'rev_301',
        productId: 4,
        userName: 'Jaxon Holt',
        userRole: 'Verified Buyer',
        rating: 5,
        title: 'Earbuds that Never Disconnect',
        comment: 'The instant pairing and spatial audio immersion make commute feel like a sci-fi sequence. 10/10.',
        date: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
    {
        id: 'rev_401',
        productId: 10,
        userName: 'Valkyrie_X',
        userRole: 'Competitive Gamer',
        rating: 5,
        title: '20,000 DPI Pure Precision',
        comment: 'Zero sensor smoothing and the optical switches register in less than 0.2ms. Ergonomics are flawless.',
        date: new Date(Date.now() - 86400000 * 14).toISOString(),
    },
];

export const findByProductId = async (productId) => {
    const targetId = Number(productId);
    const reviews = await Review.find({ productId: targetId }).sort({ createdAt: -1 }).lean();

    // If a product doesn't have custom reviews yet, supply general default verified reviews
    if (reviews.length === 0) {
        return [
            {
                id: `rev_gen_${targetId}_1`,
                productId: targetId,
                userName: 'Cyber Vanguard',
                userRole: 'Verified Buyer',
                rating: 5,
                title: 'High-Grade Industrial Quality',
                comment: 'Top-tier ergonomics and build quality. Performs exactly as advertised in high-stress benchmarks.',
                date: new Date(Date.now() - 86400000 * 3).toISOString(),
            },
            {
                id: `rev_gen_${targetId}_2`,
                productId: targetId,
                userName: 'ZeroCool',
                userRole: 'Verified Buyer',
                rating: 4,
                title: 'Solid Hardware Addition',
                comment: 'Sleek dark finish, instant device synchronization, and robust construction. Very pleased with the purchase.',
                date: new Date(Date.now() - 86400000 * 8).toISOString(),
            },
        ];
    }

    return reviews;
};

export const addReview = async ({ productId, userName, userRole, rating, title, comment }) => {
    const newReview = new Review({
        id: 'rev_' + Date.now(),
        productId: Number(productId),
        userName: userName?.trim() || 'Anonymous Operative',
        userRole: userRole || 'Verified Customer',
        rating: Math.min(5, Math.max(1, Number(rating) || 5)),
        title: title?.trim() || 'Exceptional Gear',
        comment: comment?.trim() || 'No written comments provided.',
        date: new Date().toISOString(),
    });

    const saved = await newReview.save();
    return saved.toObject();
};
