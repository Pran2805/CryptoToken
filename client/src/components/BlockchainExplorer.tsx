import React from 'react';
import { FiActivity, FiRefreshCw, FiCheckCircle, FiLock } from 'react-icons/fi';
import type { Block } from '../types';

interface BlockchainExplorerProps {
    blocks: Block[];
    loading?: boolean;
    onRefresh: () => void;
    onValidate: () => void;
    validateLoading?: boolean;
}

const BlockchainExplorer: React.FC<BlockchainExplorerProps> = ({
    blocks,
    loading,
    onRefresh,
    onValidate,
    validateLoading
}) => {
    return (
        <div className="card group hover:border-indigo-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600 group-hover:scale-110 transition-transform">
                        <FiActivity />
                    </div>
                    Blockchain Explorer
                </h3>
                <div className="flex gap-2">
                    <button onClick={onRefresh} className="btn-secondary group/btn">
                        <FiRefreshCw className={`inline mr-2 ${loading ? 'animate-spin' : 'group-hover/btn:rotate-180 transition-transform duration-500'}`} />
                        Refresh
                    </button>
                    <button onClick={onValidate} disabled={validateLoading} className="btn-secondary">
                        <FiCheckCircle className="inline mr-2" />
                        Validate
                    </button>
                </div>
            </div>

            <div className="max-h-96 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-gray-100">
                {blocks.map((block, idx) => (
                    <div key={block.index} className="block-item hover:scale-102 transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold flex items-center gap-1">
                                <FiLock className="text-xs" />
                                Block #{block.index}
                            </span>
                            <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                {block.hash.slice(0, 20)}...
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mt-3">
                            <div className="text-sm bg-white p-2 rounded-lg flex items-center gap-1">
                                <span className="text-gray-500">📅</span>
                                {new Date(block.timestamp).toLocaleString()}
                            </div>
                            <div className="text-sm bg-white p-2 rounded-lg flex items-center gap-1">
                                <span className="text-gray-500">📝</span>
                                {block.transactions.length} txns
                            </div>
                            <div className="text-sm bg-white p-2 rounded-lg flex items-center gap-1">
                                <span className="text-gray-500">⛏️</span>
                                Nonce: {block.nonce}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BlockchainExplorer;