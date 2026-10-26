import ApiError from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import * as UserModel from '../models/user.model.js';
import * as ProductModel from '../models/product.model.js';
import * as OrderModel from '../models/order.model.js';

const MAX_LINES = 100;
const MAX_QUANTITY = 99;

// GET /api/user/data
export const getUserData = asyncHandler(async (req, res) => {
    const user = await UserModel.findById(req.user.id);
    const orders = await OrderModel.findByUser(req.user.id);

    res.json({ cart: user.cart, wishlist: user.wishlist, orders });
});

// PUT /api/user/cart   body: { cart: [{ id, quantity }] }
export const updateCart = asyncHandler(async (req, res) => {
    const { cart } = req.body ?? {};
    if (!Array.isArray(cart) || cart.length > MAX_LINES) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Cart must be an array of items.');
    }

    // Rebuild the cart from the catalogue so prices and names always come from the server.
    const merged = new Map();
    for (const line of cart) {
        const id = Number(line?.id);
        const quantity = Math.min(Math.max(Math.floor(Number(line?.quantity)) || 1, 1), MAX_QUANTITY);
        if (Number.isInteger(id)) merged.set(id, Math.min((merged.get(id) ?? 0) + quantity, MAX_QUANTITY));
    }

    const rebuilt = [];
    for (const [id, quantity] of merged) {
        const product = await ProductModel.findById(id);
        if (product) rebuilt.push({ ...product, quantity });
    }

    await UserModel.update(req.user.id, { cart: rebuilt });
    res.json({ msg: 'Cart updated', cart: rebuilt });
});

// PUT /api/user/wishlist   body: { wishlist: [{ id }] }
export const updateWishlist = asyncHandler(async (req, res) => {
    const { wishlist } = req.body ?? {};
    if (!Array.isArray(wishlist) || wishlist.length > MAX_LINES) {
        throw new ApiError(400, 'VALIDATION_ERROR', 'Wishlist must be an array of items.');
    }

    const ids = [...new Set(wishlist.map((item) => Number(item?.id)).filter(Number.isInteger))];

    const rebuilt = [];
    for (const id of ids) {
        const product = await ProductModel.findById(id);
        if (product) rebuilt.push(product);
    }

    await UserModel.update(req.user.id, { wishlist: rebuilt });
    res.json({ msg: 'Wishlist updated', wishlist: rebuilt });
});
