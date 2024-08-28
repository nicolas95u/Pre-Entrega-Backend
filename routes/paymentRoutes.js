import express from 'express';
import { initiatePayment, handleWebhook } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-session', initiatePayment);

router.post('/webhook', handleWebhook);

export default router;
