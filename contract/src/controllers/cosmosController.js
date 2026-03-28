import { CosmosClient } from '../scripts/CosmosClient.js';
import { validateAddress, validateAmount } from '../utils/validators.js';

const cosmosClient = new CosmosClient();

export const connectToCosmos = async (req, res) => {
    try {
        const { mnemonic } = req.body;
        const result = await cosmosClient.connectToTestnet(mnemonic);
        
        if (result.success) {
            res.json({
                success: true,
                address: result.address,
                mnemonic: result.mnemonic,
                message: 'Successfully connected to Cosmos testnet'
            });
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

export const getCosmosBalance = async (req, res) => {
    try {
        const { address } = req.query;
        
        // Validate address if provided
        if (address) {
            const addressError = validateAddress(address);
            if (addressError) {
                return res.status(400).json({ success: false, error: addressError });
            }
        }
        
        const result = await cosmosClient.getBalance(address);
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

export const sendCosmosTokens = async (req, res) => {
    try {
        const { recipientAddress, amount, denom, memo } = req.body;

        // Validate inputs
        if (!recipientAddress) {
            return res.status(400).json({
                success: false,
                error: 'recipientAddress is required'
            });
        }
        
        if (!amount) {
            return res.status(400).json({
                success: false,
                error: 'amount is required'
            });
        }

        const amountError = validateAmount(amount);
        if (amountError) {
            return res.status(400).json({ success: false, error: amountError });
        }

        const result = await cosmosClient.sendTokens(
            recipientAddress,
            parseFloat(amount),
            denom || 'uatom',
            memo || ''
        );
        
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

export const getCosmosStatus = async (req, res) => {
    try {
        const result = await cosmosClient.getNetworkStatus();
        res.json(result);
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

export const disconnectFromCosmos = (req, res) => {
    try {
        cosmosClient.disconnect();
        res.json({ 
            success: true, 
            message: 'Disconnected from Cosmos network' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};