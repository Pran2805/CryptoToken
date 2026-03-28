import userRoutes from './userRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import blockRoutes from './blockRoutes.js';
import cosmosRoutes from './cosmosRoutes.js';

export const setupRoutes = (app) => {
    // API Routes
    app.use('/api', userRoutes);
    app.use('/api', transactionRoutes);
    app.use('/api', blockRoutes);
    app.use('/api/cosmos', cosmosRoutes);
    
    // Health check route
    app.get('/health', (req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    // 404 handler for undefined routes - FIXED: removed wildcard '*'
    app.use((req, res) => {
        res.status(404).json({ 
            success: false, 
            error: `Route ${req.originalUrl} not found` 
        });
    });
};