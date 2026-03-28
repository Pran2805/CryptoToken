import React from 'react';
import type { ChainInfo } from '../types';
import { FiAward, FiZap } from 'react-icons/fi';

interface HeaderProps {
    chainInfo: ChainInfo;
}

const Header: React.FC<HeaderProps> = ({ chainInfo }) => {
    const infoItems = [
        { icon: '⛓️', label: 'Block', value: chainInfo.blockHeight, color: 'blue' },
        { icon: '👥', label: 'Users', value: chainInfo.totalUsers, color: 'purple' },
        { icon: '⏳', label: 'Pending', value: chainInfo.pendingTransactions, color: 'yellow' },
        { icon: '🪙', label: 'Supply', value: chainInfo.totalSupply.toLocaleString(), color: 'green' },
    ];

    return (
        <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-center md:text-left group">
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
                            <span className="text-5xl animate-bounce">💰</span>
                            DSurv Token
                        </h1>
                        <p className="text-gray-600 mt-1 flex items-end gap-2 justify-end md:justify-end">
                            <FiZap className="text-yellow-500" />
                            Blockchain & Cosmos Integration
                            <FiAward className="text-purple-500" />
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3 justify-center">
                        {infoItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="group relative bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                            >
                                <div className={`absolute inset-0 bg-gradient-to-r from-${item.color}-500/0 to-${item.color}-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                                <span className="text-gray-600">{item.icon} {item.label}</span>
                                <span className={`ml-2 font-bold text-${item.color}-600`}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;