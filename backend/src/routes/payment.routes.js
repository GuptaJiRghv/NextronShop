import { Router } from 'express';
import {
    confirmPayment,
    createPaymentSession,
    getNetworkInfo,
    getPaymentDetails,
    getPaymentStatus,
} from '../controllers/payment.controller.js';

const router = Router();

router.get('/network-info', getNetworkInfo);
router.post('/create-session', createPaymentSession);
router.get('/status/:txId', getPaymentStatus);
router.get('/details/:txId', getPaymentDetails);
router.post('/confirm', confirmPayment);

export default router;
