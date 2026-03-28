import React from 'react';
import { FiDollarSign } from 'react-icons/fi';
import LoadingSpinner from '../common/LoadingSpinner';
import type { CosmosBalance as CosmosBalanceType } from '../../types';

interface CosmosBalanceProps {
    address: string;
    balance: CosmosBalanceType[] | null;
    loading?: boolean;
    onAddressChange: (value: string) => void;
    onCheckBalance: () => void;
}

const CosmosBalance: React.FC<CosmosBalanceProps> = ({
    address,
    balance,
    loading,
    onAddressChange,
    onCheckBalance
}) => {
    return (
        <div className="card group hover:border-violet-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="p-2 bg-violet-100 rounded-lg text-violet-600 group-hover:scale-110 transition-transform">
                    <FiDollarSign />
                </div>
                Check Cosmos Balance
            </h3>
            <div className="space-y-3">
                <input
                    type="text"
                    value={address}
                    onChange={(e) => onAddressChange(e.target.value)}
                    placeholder="Enter address (optional)"
                    className="input-field"
                />
                <button
                    onClick={onCheckBalance}
                    disabled={loading}
                    className="btn-blue w-full bg-gradient-to-r from-violet-500 to-purple-600"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Checking...
                        </span>
                    ) : (
                        <span className="flex items-center justify-center gap-2">
                            <FiDollarSign />
                            Check Balance
                        </span>
                    )}
                </button>
                {balance && balance.length > 0 && (
                    <div className="result-success">
                        {balance.map((b, i) => (
                            <div key={i} className="flex justify-between items-center bg-white p-2 rounded mb-1">
                                <span className="font-mono">{b.amount}</span>
                                <span className="badge badge-success">{b.denom}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CosmosBalance;