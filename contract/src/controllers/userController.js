import { LocalBlockchain } from '../scripts/LocalBlockchain.js';
import { validateUsername, validateAddress } from '../utils/validators.js';

const localBlockchain = new LocalBlockchain();

export const createUser = (req, res) => {
    try {
        const { username, publicKey } = req.body;
        
        // Validate input
        const usernameError = validateUsername(username);
        if (usernameError) {
            return res.status(400).json({ success: false, error: usernameError });
        }

        const user = localBlockchain.createUser(username, publicKey);
        res.json({
            success: true,
            user,
            message: `Welcome ${username}! You received 1000 tokens.`
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

export const getAllUsers = (req, res) => {
    try {
        const users = localBlockchain.getAllUsers();
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getUserByUsername = (req, res) => {
    try {
        const { username } = req.params;
        const user = localBlockchain.getUser(username);
        
        if (user) {
            res.json({ success: true, user });
        } else {
            res.status(404).json({ success: false, error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getBalanceByAddress = (req, res) => {
    try {
        const { address } = req.params;
        
        // Validate address
        const addressError = validateAddress(address);
        if (addressError) {
            return res.status(400).json({ success: false, error: addressError });
        }
        
        const balance = localBlockchain.getBalance(address);
        const user = localBlockchain.getUserByAddress(address);
        
        res.json({
            success: true,
            balance,
            address,
            username: user?.username || 'Unknown'
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};