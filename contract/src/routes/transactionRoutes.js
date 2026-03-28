import express from 'express';
import {
    createTransaction,
    mineTransactions,
    getTransactionHistory,
    validateChain
} from '../controllers/transactionController.js';

const router = express.Router();

// Transaction routes
router.post('/transactions', createTransaction);
router.post('/mine', mineTransactions);
router.get('/transactions/history/:address', getTransactionHistory);
router.get('/validate', validateChain);

export default router;