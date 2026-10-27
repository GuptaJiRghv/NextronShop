import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS_DATA } from '../data';
import { api } from '../services/api';

const StoreContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useStore = () => useContext(StoreContext);

const NETWORK_ERROR = {
    success: false,
    error: 'NETWORK_ERROR',
    message: 'Network error. Please make sure the server is running and try again.',
};

export const StoreProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState(PRODUCTS_DATA);

    // UI State
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

    // Auth State
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('omnyx_user') || localStorage.getItem('nextron_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Fetch the catalogue on load (falls back to static data if the API is down)
    useEffect(() => {
        api.get('/products', { auth: false })
            .then(({ ok, data }) => {
                if (ok && Array.isArray(data) && data.length > 0) {
                    setProducts(data);
                }
            })
            .catch(console.error);
    }, []);

    // Load cart, wishlist and orders for the logged-in user
    useEffect(() => {
        if (!user) {
            setCart([]);
            setWishlist([]);
            setOrders([]);
            return;
        }

        api.get('/user/data')
            .then(({ ok, status, data }) => {
                if (ok) {
                    setCart(data.cart ?? []);
                    setWishlist(data.wishlist ?? []);
                    setOrders(data.orders ?? []);
                } else if (status === 401) {
                    // Token expired or the server restarted (in-memory accounts are wiped)
                    localStorage.removeItem('omnyx_token');
                    localStorage.removeItem('omnyx_user');
                    localStorage.removeItem('nextron_token');
                    localStorage.removeItem('nextron_user');
                    setUser(null);
                }
            })
            .catch(console.error);
    }, [user]);

    // Theme State
    const [theme, setTheme] = useState(() => localStorage.getItem('omnyx_theme') || localStorage.getItem('nextron_theme') || 'dark');

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('omnyx_theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    const navigate = useNavigate();

    const navigateToCategory = (categoryId) => {
        navigate(`/products?category=${categoryId}`);
    };

    // ─── Cart / wishlist ─────────────────────────────────────────────────────

    const syncCart = async (newCart) => {
        if (!user) return;
        await api
            .put('/user/cart', { cart: newCart.map(({ id, quantity }) => ({ id, quantity })) })
            .catch(console.error);
    };

    const syncWishlist = async (newWishlist) => {
        if (!user) return;
        await api
            .put('/user/wishlist', { wishlist: newWishlist.map(({ id }) => ({ id })) })
            .catch(console.error);
    };

    const getAvailableStock = (product) =>
        products.find(p => p.id === product.id)?.stock ?? product.stock;

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        const currentQuantity = existing ? existing.quantity : 0;

        setIsCartOpen(true);
        if (getAvailableStock(product) <= currentQuantity) return; // no more stock to add

        const newCart = existing
            ? cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
            : [...cart, { ...product, quantity: 1 }];

        setCart(newCart);
        syncCart(newCart);
    };

    const removeFromCart = (productId) => {
        const newCart = cart.filter(item => item.id !== productId);
        setCart(newCart);
        syncCart(newCart);
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        const item = cart.find(entry => entry.id === productId);
        if (!item) return;

        const capped = Math.min(quantity, getAvailableStock(item));
        const newCart = cart.map(entry => entry.id === productId ? { ...entry, quantity: capped } : entry);
        setCart(newCart);
        syncCart(newCart);
    };

    const reorderItems = (orderItems) => {
        if (!Array.isArray(orderItems) || orderItems.length === 0) return;
        let updatedCart = [...cart];
        orderItems.forEach((orderItem) => {
            const product = products.find(p => p.id === orderItem.id) || orderItem;
            const availableStock = getAvailableStock(product);
            const existing = updatedCart.find(item => item.id === orderItem.id);
            const addQty = orderItem.quantity || 1;
            if (existing) {
                const newQty = Math.min(existing.quantity + addQty, availableStock);
                updatedCart = updatedCart.map(item => item.id === orderItem.id ? { ...item, quantity: newQty } : item);
            } else {
                const initialQty = Math.min(addQty, availableStock);
                if (initialQty > 0) {
                    updatedCart.push({ ...product, quantity: initialQty });
                }
            }
        });
        setCart(updatedCart);
        syncCart(updatedCart);
        setIsCartOpen(true);
    };

    const addToWishlist = (product) => {
        if (!wishlist.find(item => item.id === product.id)) {
            const newWishlist = [...wishlist, product];
            setWishlist(newWishlist);
            syncWishlist(newWishlist);
        }
    };

    const removeFromWishlist = (productId) => {
        const newWishlist = wishlist.filter(item => item.id !== productId);
        setWishlist(newWishlist);
        syncWishlist(newWishlist);
    };

    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    // ─── Orders ──────────────────────────────────────────────────────────────

    /**
     * Sends the cart to the API. The server re-prices the order and checks stock.
     * @returns {Promise<{ success: boolean, order?: object, error?: string }>}
     */
    const placeOrder = async (customerInfo) => {
        const payload = {
            items: cart.map(({ id, quantity }) => ({ id, quantity })),
            customerInfo,
            date: new Date().toISOString(),
        };

        try {
            const { ok, data } = await api.post('/orders', payload, { auth: !!user });

            if (!ok) {
                return { success: false, error: data?.message || 'Could not place your order.' };
            }

            setOrders(prev => [data, ...prev]);

            // Mirror the server-side stock reduction locally
            setProducts(prev => prev.map(p => {
                const line = cart.find(item => item.id === p.id);
                return line ? { ...p, stock: p.stock - line.quantity } : p;
            }));

            setCart([]);
            return { success: true, order: data };
        } catch (err) {
            console.error(err);
            return { success: false, error: NETWORK_ERROR.message };
        }
    };

    // ─── Auth ────────────────────────────────────────────────────────────────

    const authenticate = async (path, body) => {
        try {
            const { ok, data } = await api.post(path, body, { auth: false });

            if (!ok) {
                return { success: false, error: data?.error, message: data?.message };
            }

            localStorage.setItem('omnyx_token', data.token);
            localStorage.setItem('omnyx_user', JSON.stringify(data.user));
            setUser(data.user);
            return { success: true };
        } catch (error) {
            console.error('Auth error:', error);
            return NETWORK_ERROR;
        }
    };

    /** @returns {Promise<{ success: boolean, error?: string, message?: string }>} */
    const signup = (email, password, name) => authenticate('/auth/signup', { name, email, password });

    /** @returns {Promise<{ success: boolean, error?: string, message?: string }>} */
    const login = (email, password) => authenticate('/auth/login', { email, password });

    const logout = () => {
        localStorage.removeItem('omnyx_token');
        localStorage.removeItem('omnyx_user');
        localStorage.removeItem('nextron_token');
        localStorage.removeItem('nextron_user');
        setUser(null);
    };

    return (
        <StoreContext.Provider value={{
            cart, wishlist, orders, products,
            isCartOpen, isWishlistOpen, isCheckoutOpen, user,
            theme, toggleTheme,
            setProducts, addToCart, removeFromCart, updateQuantity, reorderItems,
            addToWishlist, removeFromWishlist, setIsCartOpen, setIsWishlistOpen,
            setIsCheckoutOpen, cartTotal, cartCount, placeOrder,
            login, logout, signup, navigateToCategory
        }}>
            {children}
        </StoreContext.Provider>
    );
};
