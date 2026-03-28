import { LocalBlockchain } from '../scripts/LocalBlockchain.js';

const localBlockchain = new LocalBlockchain();

export const getChainInfo = (req, res) => {
    try {
        const info = localBlockchain.getChainInfo();
        res.json({ 
            success: true, 
            info,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getAllBlocks = (req, res) => {
    try {
        const blocks = localBlockchain.blocks;
        res.json({ 
            success: true, 
            blocks,
            count: blocks.length
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

export const getBlockByIndex = (req, res) => {
    try {
        const index = parseInt(req.params.index);
        
        if (isNaN(index) || index < 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'Invalid block index' 
            });
        }
        
        if (index >= 0 && index < localBlockchain.blocks.length) {
            res.json({ 
                success: true, 
                block: localBlockchain.blocks[index] 
            });
        } else {
            res.status(404).json({ 
                success: false, 
                error: `Block #${index} not found` 
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};