import express from 'express';
import {
    connectToCosmos,
    getCosmosBalance,
    sendCosmosTokens,
    getCosmosStatus,
    disconnectFromCosmos
} from '../controllers/cosmosController.js';

const router = express.Router();

// Cosmos routes
router.post('/connect', connectToCosmos);
router.get('/balance', getCosmosBalance);
router.post('/send', sendCosmosTokens);
router.get('/status', getCosmosStatus);
router.post('/disconnect', disconnectFromCosmos);

export default router;