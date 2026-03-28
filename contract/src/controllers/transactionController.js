import { LocalBlockchain } from '../scripts/LocalBlockchain.js';
import { validateTransaction, validateAddress, validateAmount } from '../utils/validators.js';

const localBlockchain = new LocalBlockchain();

export const createTransaction = (req, res) => {
    try {
        const { fromAddress, toAddress, amount } = req.body;
        
        // Validate inputs
        const validationError = validateTransaction(fromAddress, toAddress, amount);
        if (validationError) {
            return res.status(400).json({ success: false, error: validationError });
        }

        const transaction = localBlockchain.createTransaction(fromAddress, toAddress, parseFloat(amount));
        res.json({
            success: true,
            transaction,
            message: 'Transaction created and pending mining'
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const mineTransactions = (req, res) => {
    try {
        const { minerAddress } = req.body;

        if (!minerAddress) {
            return res.status(400).json({ 
                success: false, 
                error: 'minerAddress is required' 
            });
        }

        const result = localBlockchain.minePendingTransactions(minerAddress);
        res.json({
            success: true,
            ...result,
            message: `Successfully mined ${result.transactionsCount} transactions in ${result.miningTime}s!`
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getTransactionHistory = (req, res) => {
    try {
        const { address } = req.params;
        const history = localBlockchain.getTransactionHistory(address);
        res.json({ success: true, history, count: history.length });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const validateChain = (req, res) => {
    try {
        const result = localBlockchain.validateChain();
        res.json({ 
            success: true, 
            ...result,
            message: result.valid ? 'Blockchain is valid!' : 'Blockchain validation failed'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};