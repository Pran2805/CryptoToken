import express from 'express';
import {
    createUser,
    getAllUsers,
    getUserByUsername,
    getBalanceByAddress
} from '../controllers/userController.js';

const router = express.Router();

// User routes
router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:username', getUserByUsername);
router.get('/balance/:address', getBalanceByAddress);

export default router;