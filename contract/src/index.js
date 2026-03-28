import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config({ quiet: true });

import { setupRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Setup all routes
setupRoutes(app);

// Error handling middleware (should be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log('🚀 CRYPTO TOKEN API STARTED SUCCESSFULLY!');
    console.log('='.repeat(60));
    console.log(`📍 API Server: http://localhost:${PORT}`);
    console.log('\n📋 Available Endpoints:');
    console.log('   Local Blockchain:');
    console.log('   POST  /api/users');
    console.log('   GET   /api/users');
    console.log('   GET   /api/balance/:address');
    console.log('   POST  /api/transactions');
    console.log('   POST  /api/mine');
    console.log('   GET   /api/chain-info');
    console.log('   GET   /api/blocks');
    console.log('   GET   /api/transactions/history/:address?');
    console.log('   GET   /api/validate');
    console.log('\n   Cosmos Network:');
    console.log('   POST  /api/cosmos/connect');
    console.log('   GET   /api/cosmos/balance?address=xxx');
    console.log('   POST  /api/cosmos/send');
    console.log('   GET   /api/cosmos/status');
    console.log('   POST  /api/cosmos/disconnect');
    console.log('='.repeat(60) + '\n');
});