import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as ProductModel from '../models/product.model.js';

const findOrFail = async (id) => {
    const product = await ProductModel.findById(id);
    if (!product) {
        throw new ApiError(404, 'PRODUCT_NOT_FOUND', 'Product not found.');
    }
    return product;
};

// GET /api/products?category=&q=&sort=price-low|price-high
export const listProducts = asyncHandler(async (req, res) => {
    const { category, q, sort } = req.query;
    let products = await ProductModel.findAll();

    if (category && category !== 'all') {
        products = products.filter((product) => product.category === category);
    }

    if (q) {
        const term = String(q).toLowerCase();
        products = products.filter(
            (product) =>
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term)
        );
    }

    if (sort === 'price-low') products.sort((a, b) => a.price - b.price);
    if (sort === 'price-high') products.sort((a, b) => b.price - a.price);

    res.json(products);
});

// GET /api/products/trending
export const getTrending = asyncHandler(async (req, res) => {
    res.json(await ProductModel.findTrending());
});

// GET /api/products/featured
export const getFeatured = asyncHandler(async (req, res) => {
    res.json(await ProductModel.findFeatured());
});

// GET /api/products/:id
export const getProduct = asyncHandler(async (req, res) => {
    res.json(await findOrFail(req.params.id));
});

// POST /api/products   (admin)
export const createProduct = asyncHandler(async (req, res) => {
    const product = await ProductModel.create(req.body);
    res.status(201).json(product);
});

// PUT /api/products/:id   (admin)
export const updateProduct = asyncHandler(async (req, res) => {
    await findOrFail(req.params.id);
    res.json(await ProductModel.update(req.params.id, req.body));
});

// DELETE /api/products/:id   (admin)
export const deleteProduct = asyncHandler(async (req, res) => {
    await findOrFail(req.params.id);
    await ProductModel.remove(req.params.id);
    res.json({ msg: 'Product deleted', id: Number(req.params.id) });
});
