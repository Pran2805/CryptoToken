import express from 'express';
import {
    getChainInfo,
    getAllBlocks,
    getBlockByIndex
} from '../controllers/blockController.js';

const router = express.Router();

// Block routes
router.get('/chain-info', getChainInfo);
router.get('/blocks', getAllBlocks);
router.get('/blocks/:index', getBlockByIndex);

export default router;