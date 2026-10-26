import { store } from '../data/store.js';

const copy = (product) => ({ ...product });

export const findAll = async () => store.products.map(copy);

export const findById = async (id) => {
    const product = store.products.find((entry) => entry.id === Number(id));
    return product ? copy(product) : null;
};

export const findTrending = async () =>
    store.products.filter((product) => product.trending).map(copy);

export const findFeatured = async () =>
    store.products.filter((product) => product.featured).map(copy);

export const create = async (data) => {
    const nextId = store.products.reduce((max, product) => Math.max(max, product.id), 0) + 1;
    const product = { id: nextId, ...data };
    store.products.push(product);
    return copy(product);
};

export const update = async (id, patch) => {
    const product = store.products.find((entry) => entry.id === Number(id));
    if (!product) return null;
    Object.assign(product, patch);
    return copy(product);
};

export const remove = async (id) => {
    const index = store.products.findIndex((entry) => entry.id === Number(id));
    if (index === -1) return false;
    store.products.splice(index, 1);
    return true;
};

/** Adds `delta` (negative to decrement) to a product's stock. */
export const adjustStock = async (id, delta) => {
    const product = store.products.find((entry) => entry.id === Number(id));
    if (!product) return null;
    product.stock = Math.max(0, product.stock + delta);
    return copy(product);
};
