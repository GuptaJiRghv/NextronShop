import os from 'os';
import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import { store } from '../data/store.js';

if (!store.payments) {
    store.payments = [];
}

export const getNetworkInterfacesList = () => {
    const interfaces = os.networkInterfaces();
    const list = [];
    const virtualPattern = /vbox|virtual|vmware|wsl|hyper-v|vethernet|pseudo|teredo|bluetooth|loopback|npcap|tap|tun/i;

    for (const [name, addrs] of Object.entries(interfaces)) {
        for (const iface of addrs) {
            if (iface.family === 'IPv4' && !iface.internal) {
                const ip = iface.address;
                const isVboxSubnet = ip.startsWith('192.168.56.');
                const isVirtual = virtualPattern.test(name) || isVboxSubnet;
                const isWifi = /wi-fi|wireless|wlan|hotspot|cellular|802\.11/i.test(name);
                // Hotspot subnets commonly used by Android / iOS
                const isHotspotSubnet = ip.startsWith('192.168.43.') || ip.startsWith('172.20.10.');

                let score = 50;
                if (isWifi) score += 100;
                if (isHotspotSubnet) score += 50;
                if (isVirtual) score -= 200;

                list.push({
                    name,
                    address: ip,
                    isWifi,
                    isVirtual,
                    score,
                });
            }
        }
    }

    list.sort((a, b) => b.score - a.score);
    return list;
};

export const getLocalIp = (preferredIp = null) => {
    const list = getNetworkInterfacesList();
    if (preferredIp) {
        const match = list.find((item) => item.address === preferredIp);
        if (match) return match.address;
    }
    if (list.length > 0) {
        return list[0].address;
    }
    return 'localhost';
};

// GET /api/payments/network-info
export const getNetworkInfo = asyncHandler(async (req, res) => {
    const candidates = getNetworkInterfacesList();
    const localIp = getLocalIp();
    res.json({
        localIp,
        port: 5173,
        interfaces: candidates.map(c => ({
            name: c.name,
            address: c.address,
            isWifi: c.isWifi,
            isVirtual: c.isVirtual,
            recommended: c.score > 0
        }))
    });
});

// POST /api/payments/create-session
export const createPaymentSession = asyncHandler(async (req, res) => {
    const { amount, orderData, preferredIp } = req.body || {};
    const txId = 'TX_' + Date.now().toString(36).toUpperCase() + '_' + Math.random().toString(36).substring(2, 6).toUpperCase();
    
    const candidates = getNetworkInterfacesList();
    const localIp = getLocalIp(preferredIp);
    const port = 5173; // Frontend Vite port
    const mobilePayUrl = `http://${localIp}:${port}/pay/confirm?tx=${txId}&amount=${amount || 0}`;

    const session = {
        txId,
        amount: Number(amount) || 0,
        orderData: orderData || null,
        status: 'pending',
        createdAt: new Date().toISOString(),
        completedAt: null,
    };

    store.payments.push(session);

    res.status(201).json({
        txId,
        amount: session.amount,
        mobilePayUrl,
        localIp,
        availableIps: candidates.map(c => ({
            name: c.name,
            address: c.address,
            isWifi: c.isWifi,
            isVirtual: c.isVirtual,
            recommended: c.score > 0
        })),
        status: session.status,
    });
});

// GET /api/payments/status/:txId
export const getPaymentStatus = asyncHandler(async (req, res) => {
    const { txId } = req.params;
    const session = store.payments.find((p) => p.txId === txId);

    if (!session) {
        throw new ApiError(404, 'TRANSACTION_NOT_FOUND', 'Payment transaction session not found.');
    }

    res.json({
        txId: session.txId,
        status: session.status,
        amount: session.amount,
        completedAt: session.completedAt,
    });
});

// GET /api/payments/details/:txId  (used by mobile phone screen)
export const getPaymentDetails = asyncHandler(async (req, res) => {
    const { txId } = req.params;
    const session = store.payments.find((p) => p.txId === txId);

    if (!session) {
        throw new ApiError(404, 'TRANSACTION_NOT_FOUND', 'Payment transaction session not found.');
    }

    res.json({
        txId: session.txId,
        amount: session.amount,
        status: session.status,
        merchant: 'Nextron Cybernetics Store',
        currency: 'USD',
        createdAt: session.createdAt,
    });
});

// POST /api/payments/confirm  (hit from phone or simulator when user clicks Confirm)
export const confirmPayment = asyncHandler(async (req, res) => {
    const { txId } = req.body || {};
    const session = store.payments.find((p) => p.txId === txId);

    if (!session) {
        throw new ApiError(404, 'TRANSACTION_NOT_FOUND', 'Transaction not found or expired.');
    }

    session.status = 'completed';
    session.completedAt = new Date().toISOString();

    res.json({
        success: true,
        txId: session.txId,
        status: 'completed',
        message: 'Payment verified and confirmed by mobile device.',
    });
});
