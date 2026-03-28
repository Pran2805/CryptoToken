import React from 'react';
import { FiDollarSign, FiUser } from 'react-icons/fi';
import LoadingSpinner from './common/LoadingSpinner';
import ResultMessage from './common/ResultMessage';
import type { BalanceResponse } from '../types';

interface CheckBalanceProps {
    loading?: boolean;
    balance: BalanceResponse | null;
    onCheckBalance: (address: string) => void;
    address: any
    onAddressChange: any
}

const CheckBalance: React.FC<CheckBalanceProps> = ({ loading, balance, onCheckBalance, address, onAddressChange }) => {
    // const [address, setAddress] = useState('');
    // console.log("address", address)

    return (
        <div className="card group hover:border-green-300">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg text-green-600 group-hover:scale-110 transition-transform">
                    <FiDollarSign />
                </div>
                Check Balance
            </h3>
            <div className="space-y-3">
                <input
                    type="text"
                    value={address}
                    placeholder="Enter address"
                    className="input-field"
                    onChange={(e) => onAddressChange(e.target.value)}
                />
                <button
                    onClick={() => onCheckBalance(address)}
                    disabled={loading}
                    className="btn-blue w-full"
                >
                    {loading ? (
                        <span className="flex items-center justify-center gap-2">
                            <LoadingSpinner />
                            Checking...
                        </span>
                    ) : (
                        'Check Balance'
                    )}
                </button>
                {balance && (
                    <ResultMessage type="success">
                        <p className="font-medium flex items-center gap-2">
                            <FiUser className="text-green-600" />
                            {balance.username}
                        </p>
                        <p className="text-2xl font-bold mt-1 flex items-center gap-2">
                            <FiDollarSign className="text-green-600" />
                            {balance.balance} tokens
                        </p>
                    </ResultMessage>
                )}
            </div>
        </div>
    );
};

export default CheckBalance;