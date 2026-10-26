// Static UI data. PRODUCTS_DATA is only an offline fallback shown until the API responds.

export const CATEGORIES = [
    {
        id: 'headphones',
        name: 'Headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop',
        description: 'Premium wireless audio',
        count: 3,
        gradient: 'from-cyan-500 to-blue-500'
    },
    {
        id: 'earbuds',
        name: 'Earbuds',
        image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&h=600&fit=crop',
        description: 'True wireless freedom',
        count: 3,
        gradient: 'from-purple-500 to-pink-500'
    },
    {
        id: 'laptops',
        name: 'Laptops',
        image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&h=600&fit=crop',
        description: 'Power meets portability',
        count: 3,
        gradient: 'from-orange-500 to-red-500'
    },
    {
        id: 'mice',
        name: 'Gaming Mice',
        image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&h=600&fit=crop',
        description: 'Precision gaming gear',
        count: 3,
        gradient: 'from-green-500 to-emerald-500'
    }
];

export const PRODUCTS_DATA = [
    { id: 1, name: 'AeroMesh Pro', category: 'headphones', price: 299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', description: 'Premium wireless headphones with spatial audio and ANC', stock: 15, featured: true, trending: true },
    { id: 2, name: 'SonicWave Elite', category: 'headphones', price: 349, image: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600', description: 'Studio-grade over-ear headphones', stock: 12, featured: false, trending: false },
    { id: 3, name: 'BassMaster Pro', category: 'headphones', price: 279, image: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', description: 'Deep bass wireless headphones', stock: 20, featured: false, trending: false },
    { id: 4, name: 'Infinity Buds', category: 'earbuds', price: 149, image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600', description: 'True wireless earbuds with active noise cancellation', stock: 25, featured: true, trending: true },
    { id: 5, name: 'CrystalSound Mini', category: 'earbuds', price: 129, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', description: 'Compact earbuds with premium sound quality', stock: 30, featured: false, trending: false },
    { id: 6, name: 'SportFit Pro', category: 'earbuds', price: 169, image: 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=600', description: 'Waterproof sports earbuds with secure fit', stock: 18, featured: false, trending: false },
    { id: 7, name: 'UltraBook X1', category: 'laptops', price: 1299, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600', description: 'Professional ultrabook with 16GB RAM', stock: 8, featured: true, trending: true },
    { id: 8, name: 'CreatorPro 15', category: 'laptops', price: 1599, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', description: 'High-performance laptop for content creators', stock: 5, featured: false, trending: false },
    { id: 9, name: 'GamingBook Elite', category: 'laptops', price: 1899, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=600', description: 'Gaming laptop with RTX 4070 graphics', stock: 6, featured: false, trending: false },
    { id: 10, name: 'Sonic Mouse Pro', category: 'mice', price: 89, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600', description: 'Wireless gaming mouse with 20000 DPI sensor', stock: 30, featured: false, trending: false },
    { id: 11, name: 'VelocityX RGB', category: 'mice', price: 79, image: 'https://images.unsplash.com/photo-1613141411244-0e4ac09bf7b1?w=600', description: 'RGB gaming mouse with customizable buttons', stock: 25, featured: true, trending: true },
    { id: 12, name: 'PrecisionPro Elite', category: 'mice', price: 99, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600', description: 'Ultra-light wireless gaming mouse', stock: 22, featured: false, trending: false }
];
