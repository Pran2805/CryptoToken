import React from 'react';
import { FiTrendingUp, FiCheckCircle, FiRefreshCw } from 'react-icons/fi';
import type { Transaction } from '../types';

interface TransactionHistoryProps {
    transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
    return (
        <div className="card group hover:border-pink-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="p-2 bg-pink-100 rounded-lg text-pink-600 group-hover:scale-110 transition-transform">
                    <FiTrendingUp />
                </div>
                Transaction History
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-pink-200 scrollbar-track-gray-100">
                {transactions.map((tx, idx) => (
                    <div key={tx.id} className="tx-item hover:scale-102 transition-all duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                            <span className="text-sm text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                                ID: {tx.id.slice(0, 8)}...
                            </span>
                            <span className={`badge ${tx.status === 'confirmed' ? 'badge-success' : 'badge-pending'} flex items-center gap-1`}>
                                {tx.status === 'confirmed' ? <FiCheckCircle /> : <FiRefreshCw className="animate-spin" />}
                                {tx.status || 'pending'}
                            </span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
                            <div className="text-sm bg-white p-2 rounded-lg">
                                <span className="text-gray-500 block text-xs">From</span>
                                {tx.fromAddress ? tx.fromAddress.slice(0, 10) + '...' : '🏆 Mining Reward'}
                            </div>
                            <div className="text-sm bg-white p-2 rounded-lg">
                                <span className="text-gray-500 block text-xs">To</span>
                                {tx.toAddress.slice(0, 10)}...
                            </div>
                            <div className="text-sm bg-white p-2 rounded-lg">
                                <span className="text-gray-500 block text-xs">Amount</span>
                                <span className="font-semibold text-green-600">{tx.amount}</span>
                            </div>
                            <div className="text-sm bg-white p-2 rounded-lg">
                                <span className="text-gray-500 block text-xs">Time</span>
                                {new Date(tx.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TransactionHistory;