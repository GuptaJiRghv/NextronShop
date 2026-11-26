import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            required: true,
            index: true,
        },
        price: {
            type: Number,
            required: true,
            min: 0,
        },
        image: {
            type: String,
            default: '',
        },
        description: {
            type: String,
            default: '',
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
            default: 0,
        },
        featured: {
            type: Boolean,
            default: false,
            index: true,
        },
        trending: {
            type: Boolean,
            default: false,
            index: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

export const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const buildProductIdQuery = (id) => {
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

export const findAll = async () => {
    return Product.find().sort({ id: 1 }).lean();
};

export const findById = async (id) => {
    return Product.findOne(buildProductIdQuery(id)).lean();
};

export const findTrending = async () => {
    return Product.find({ trending: true }).sort({ id: 1 }).lean();
};

export const findFeatured = async () => {
    return Product.find({ featured: true }).sort({ id: 1 }).lean();
};

export const create = async (data) => {
    let nextId = Number(data?.id);
    if (Number.isNaN(nextId) || !nextId) {
        const lastProduct = await Product.findOne().sort({ id: -1 }).select('id').lean();
        nextId = (lastProduct?.id || 0) + 1;
    }

    const product = new Product({
        ...data,
        id: nextId,
    });

    const saved = await product.save();
    return saved.toObject();
};

export const update = async (id, patch) => {
    return Product.findOneAndUpdate(buildProductIdQuery(id), { $set: patch }, { new: true }).lean();
};

export const remove = async (id) => {
    const result = await Product.deleteOne(buildProductIdQuery(id));
    return result.deletedCount > 0;
};

/** Adds `delta` (negative to decrement) to a product's stock. */
export const adjustStock = async (id, delta) => {
    const product = await Product.findOne(buildProductIdQuery(id));
    if (!product) return null;

    product.stock = Math.max(0, product.stock + Number(delta));
    await product.save();
    return product.toObject();
};
